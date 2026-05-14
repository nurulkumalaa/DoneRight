const BASE_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

// EDIT TASK STATE
let editMode = false;
let editId = null;

// =========================
// PROFILE STATE
// =========================
let profileEditMode = false;

// =========================
// PROFILE
// =========================
async function getProfile() {

    const response = await fetch(`${BASE_URL}/users/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const user = await response.json();

    document.getElementById("profileBox").innerHTML = `
        <p><b>Username:</b> ${user.username}</p>
        <p><b>Email:</b> ${user.email}</p>
    `;
}

// SHOW EDIT PROFILE FORM
function showEditProfile() {

    document.getElementById("profileForm").style.display = "block";

    document.getElementById("profileUsername").value = "";
    document.getElementById("profileEmail").value = "";
    document.getElementById("profilePassword").value = "";
}

// CANCEL EDIT PROFILE
function cancelEditProfile() {

    document.getElementById("profileForm").style.display = "none";
}

// UPDATE PROFILE
async function updateProfile() {

    const username =
        document.getElementById("profileUsername").value;

    const email =
        document.getElementById("profileEmail").value;

    const password =
        document.getElementById("profilePassword").value;

    await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            username,
            email,
            password: password || null,
        }),
    });

    cancelEditProfile();
    getProfile();
}

// DELETE ACCOUNT
async function deleteAccount() {

    const yes = confirm("Delete account permanently?");
    if (!yes) return;

    await fetch(`${BASE_URL}/users/profile`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    localStorage.clear();
    window.location.href = "home.html";
}

// =========================
// PRODUCTIVITY
// =========================
async function getMyProductivity() {

    try {
        const response = await fetch(`${BASE_URL}/statistics/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const stats = await response.json();

        document.getElementById("myProductivityBox").style.display = "none";

        const table = document.getElementById("myStatsTable");

        table.innerHTML = `
            <tr>
                <td>${stats.total_tasks}</td>
                <td>${stats.on_time}</td>
                <td>${stats.overdue}</td>
                <td>${stats.pending}</td>
                <td>${stats.productivity}%</td>
            </tr>
        `;
    } catch (error) {
        console.error(error);
        document.getElementById("myProductivityBox").innerText = "Failed to load productivity";
    }
}

async function downloadMyPDF() {

    const response = await fetch(`${BASE_URL}/statistics/pdf/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "my-productivity-report.pdf";

    document.body.appendChild(a);

    a.click();

    a.remove();
}

// =========================
// CATEGORY
// =========================
async function addCategory() {

    const name = document.getElementById("categoryName").value;

    await fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
    });

    document.getElementById("categoryName").value = "";
    getCategories();
}

async function getCategories() {

    const response = await fetch(`${BASE_URL}/categories`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const categories = await response.json();

    const select = document.getElementById("category");
    const filterSelect = document.getElementById("filterCategory");

    select.innerHTML = `
        <option value="">No Category</option>
    `;

    filterSelect.innerHTML = `
        <option value="">All Categories</option>
        <option value="null">No Category</option>
    `;

    categories.forEach((category) => {
        const optionHTML = `
            <option value="${category.id_categories}">
                ${category.name}
            </option>
        `;
        select.innerHTML += optionHTML;
        if (filterSelect) filterSelect.innerHTML += optionHTML;
    });
}

// =========================
// TASKS
// =========================
let allTasks = [];

async function getTasks() {

    const response = await fetch(`${BASE_URL}/tasks`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    allTasks = await response.json();
    renderTasks();
}

function renderTasks() {

    const search =
        document
            .getElementById(
                "searchTask"
            )
            ?.value
            .toLowerCase() || "";

    const category =
        document
            .getElementById(
                "filterCategory"
            )
            ?.value || "";

    const priority =
        document
            .getElementById(
                "filterPriority"
            )
            ?.value || "";

    const status =
        document
            .getElementById(
                "filterStatus"
            )
            ?.value || "";

    const sortBy =
        document
            .getElementById(
                "sortTask"
            )
            ?.value || "newest";

    let filtered =
        allTasks.filter(
            (task) => {

                const titleMatch =
                    task.title
                        .toLowerCase()
                        .includes(
                            search
                        );

                const descMatch =
                    task.description
                        ? task.description
                            .toLowerCase()
                            .includes(
                                search
                            )
                        : false;

                const matchSearch =
                    titleMatch ||
                    descMatch;

                const matchCategory =
                    category === "" ||
                    (
                        category ===
                            "null"
                            ? !task.category_id
                            : String(
                                task.category_id
                            ) === category
                    );

                const matchPriority =
                    priority === "" ||
                    task.priority ===
                    priority;

                // =====================
                // STATUS LOGIC
                // =====================
                const now =
                    new Date();

                const deadline =
                    task.deadline
                        ? new Date(
                            task.deadline
                        )
                        : null;

                let taskStatus =
                    "pending";

                // DONE
                if (
                    task.is_completed
                ) {

                    // DONE TELAT
                    if (
                        deadline &&
                        task.completed_at &&
                        new Date(
                            task.completed_at
                        ) > deadline
                    ) {

                        taskStatus =
                            "overdue";

                    } else {

                        taskStatus =
                            "done";
                    }

                }

                // BELUM DONE
                else {

                    // DEADLINE LEWAT
                    if (
                        deadline &&
                        deadline < now
                    ) {

                        taskStatus =
                            "overdue";

                    }
                }

                const matchStatus =
                    status === "" ||
                    taskStatus ===
                    status;

                return (
                    matchSearch &&
                    matchCategory &&
                    matchPriority &&
                    matchStatus
                );
            }
        );

    // =====================
    // SORT
    // =====================
    filtered.sort(
        (a, b) => {

            if (
                sortBy ===
                "newest"
            ) {

                return (
                    new Date(
                        b.created_at
                    ) -
                    new Date(
                        a.created_at
                    )
                );
            }

            if (
                sortBy ===
                "oldest"
            ) {

                return (
                    new Date(
                        a.created_at
                    ) -
                    new Date(
                        b.created_at
                    )
                );
            }

            if (
                sortBy ===
                "deadline_asc"
            ) {

                if (
                    !a.deadline
                ) return 1;

                if (
                    !b.deadline
                ) return -1;

                return (
                    new Date(
                        a.deadline
                    ) -
                    new Date(
                        b.deadline
                    )
                );
            }

            if (
                sortBy ===
                "deadline_desc"
            ) {

                if (
                    !a.deadline
                ) return 1;

                if (
                    !b.deadline
                ) return -1;

                return (
                    new Date(
                        b.deadline
                    ) -
                    new Date(
                        a.deadline
                    )
                );
            }

            const p = {
                high: 3,
                medium: 2,
                low: 1,
            };

            if (
                sortBy ===
                "priority_desc"
            ) {

                return (
                    p[
                    b.priority
                    ] -
                    p[
                    a.priority
                    ]
                );
            }

            if (
                sortBy ===
                "priority_asc"
            ) {

                return (
                    p[
                    a.priority
                    ] -
                    p[
                    b.priority
                    ]
                );
            }

            return 0;
        }
    );

    const taskList =
        document.getElementById(
            "taskList"
        );

    taskList.innerHTML =
        "";

    filtered.forEach(
        (task) => {

            const now =
                new Date();

            const deadline =
                task.deadline
                    ? new Date(
                        task.deadline
                    )
                    : null;

            let statusText =
                "Pending";

            let overdueText =
                "";

            // DONE
            if (
                task.is_completed
            ) {

                if (
                    deadline &&
                    task.completed_at &&
                    new Date(
                        task.completed_at
                    ) > deadline
                ) {

                    statusText =
                        "Overdue";

                    overdueText =
                        ` <strong style="color:red;">
                            (LATE)
                        </strong>`;

                } else {

                    statusText =
                        "Done";
                }

            }

            // BELUM DONE
            else {

                if (
                    deadline &&
                    deadline < now
                ) {

                    statusText =
                        "Overdue";

                    overdueText =
                        ` <strong style="color:red;">
                            (OVERDUE)
                        </strong>`;

                }
            }

            taskList.innerHTML += `
                <div>

                    <h3>
                        ${task.title}
                    </h3>

                    <p>
                        Description:
                        ${task.description ||
                "-"
                }
                    </p>

                    <p>
                        Category:
                        ${task.category_name ||
                "No Category"
                }
                    </p>

                    <p>
                        Priority:
                        ${task.priority}
                    </p>

                    <p>
                        Deadline:
                        ${task.deadline
                    ? new Date(
                        task.deadline
                    ).toLocaleString()
                    + overdueText
                    : "-"
                }
                    </p>

                    <p>
                        Status:
                        ${statusText}
                    </p>

                    <button
                        onclick="
                            toggleTask(
                                ${task.id_tasks}
                            )
                        "
                    >
                        Toggle Done
                    </button>

                    <button
                        onclick="
                            startEdit(
                                ${task.id_tasks},
                                \`${task.title}\`,
                                \`${task.description || ""}\`,
                                ${task.category_id || "null"},
                                \`${task.priority}\`,
                                \`${task.deadline || ""}\`
                            )
                        "
                    >
                        Edit
                    </button>

                    <button
                        onclick="
                            deleteTask(
                                ${task.id_tasks}
                            )
                        "
                    >
                        Delete
                    </button>

                    <hr>

                </div>
            `;
        }
    );
}

// ADD / UPDATE TASK
async function addTask() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category_id = document.getElementById("category").value;
    const priority = document.getElementById("priority").value;
    const deadline = document.getElementById("deadline").value;

    const payload = {
        title,
        description,
        category_id: category_id || null,
        priority,
        deadline,
    };

    if (editMode) {

        await fetch(`${BASE_URL}/tasks/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        editMode = false;
        editId = null;

        document.querySelector("button[onclick='addTask()']").innerText = "Add Task";

    } else {

        await fetch(`${BASE_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
    }

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("deadline").value = "";
    document.getElementById("category").value = "";
    document.getElementById("priority").value = "medium";

    getTasks();
    getTrash();
}

// START EDIT TASK
function startEdit(id, title, description, category_id, priority, deadline) {

    editMode = true;
    editId = id;

    document.getElementById("title").value = title;
    document.getElementById("description").value = description;
    document.getElementById("category").value = category_id !== "null" ? category_id : "";
    document.getElementById("priority").value = priority;

    if (deadline && deadline !== "null" && deadline !== "") {
        const d = new Date(deadline);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = new Date(d - tzOffset).toISOString().slice(0, 16);
        document.getElementById("deadline").value = localISOTime;
    } else {
        document.getElementById("deadline").value = "";
    }

    document.querySelector("button[onclick='addTask()']").innerText = "Update Task";
}

// TOGGLE TASK
async function toggleTask(id) {

    await fetch(`${BASE_URL}/tasks/toggle/${id}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    getTasks();
    getTrash();
}

// DELETE TASK
async function deleteTask(id) {

    await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    getTasks();
    getTrash();
}

// =========================
// TRASH
// =========================
async function getTrash() {

    const response = await fetch(`${BASE_URL}/tasks/trash`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const tasks = await response.json();

    const trash = document.getElementById("trashList");

    trash.innerHTML = "";

    tasks.forEach((task) => {
        trash.innerHTML += `
            <div>

                <h3>${task.title}</h3>

                <p>Category: ${task.category_name || "No Category"}</p>
                <p>Priority: ${task.priority}</p>

                <p>Deleted At: ${new Date(task.deleted_at).toLocaleString()}</p>

                <button onclick="restoreTask(${task.id_tasks})">
                    Restore
                </button>

                <button onclick="permanentDeleteTask(${task.id_tasks})">
                    Delete Permanently
                </button>

                <hr>

            </div>
        `;
    });
}

// RESTORE
async function restoreTask(id) {

    await fetch(`${BASE_URL}/tasks/restore/${id}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    getTasks();
    getTrash();
}

// PERMANENT DELETE
async function permanentDeleteTask(id) {

    if (!confirm("Delete permanently?")) return;

    await fetch(`${BASE_URL}/tasks/permanent/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    getTasks();
    getTrash();
}

// LOGOUT
function logout() {
    localStorage.clear();
    window.location.href = "home.html";
}

// INIT
getProfile();
getMyProductivity();
getCategories();
getTasks();
getTrash();