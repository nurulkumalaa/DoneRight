// const BASE_URL =
//     "http://localhost:5000/api";

// let editCategoryId = null;

// const token =
//     localStorage.getItem(
//         "token"
//     );

// async function getStats() {
//     const response =
//         await fetch(
//             `${BASE_URL}/admin/statistics`,
//             {
//                 headers: {
//                     Authorization:
//                         `Bearer ${token}`,
//                 },
//             }
//         );

//     const data =
//         await response.json();

//     document.getElementById(
//         "stats"
//     ).innerHTML = `
//     <p>
//       Total Users:
//       ${data.total_users}
//     </p>

//     <p>
//       Total Tasks:
//       ${data.total_tasks}
//     </p>

//     <p>
//       Completed:
//       ${data.completed_tasks}
//     </p>
//   `;
// }

// async function getTasks() {
//     const response =
//         await fetch(
//             `${BASE_URL}/admin/tasks`,
//             {
//                 headers: {
//                     Authorization:
//                         `Bearer ${token}`,
//                 },
//             }
//         );

//     const tasks =
//         await response.json();

//     const container =
//         document.getElementById(
//             "tasks"
//         );

//     container.innerHTML = "";

//     tasks.forEach((task) => {
//         container.innerHTML += `
//       <div>
//         <h3>${task.title}</h3>
//         <p>User: ${task.username}</p>
//         <p>Description: ${task.description || "-"}</p>
//         <p>Category: ${task.category_name || "No Category"}</p>
//         <p>Priority: ${task.priority}</p>
//         <p>Deadline: ${task.deadline ? new Date(task.deadline).toLocaleString() : "-"}</p>
//         <p>Status: ${task.is_completed ? "Done" : "Not Yet"}</p>
//         <hr>
//       </div>
//     `;
//     });
// }

// async function getOverdueTasks() {
//     const response = await fetch(`${BASE_URL}/admin/overdue`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     const tasks = await response.json();
//     const container = document.getElementById("overdueTasks");
//     container.innerHTML = "";
//     tasks.forEach((task) => {
//         container.innerHTML += `
//       <div>
//         <h3>${task.title} <strong style='color:red;'>(OVERDUE)</strong></h3>
//         <p>Deadline: ${task.deadline ? new Date(task.deadline).toLocaleString() : "-"}</p>
//         <hr>
//       </div>
//     `;
//     });
// }

// async function getGlobalCategories() {
//     const response = await fetch(`${BASE_URL}/admin/categories`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     const categories = await response.json();
//     const container = document.getElementById("categoriesList");
//     container.innerHTML = "";
//     categories.forEach((cat) => {
//         container.innerHTML += `
//       <div style="margin-bottom: 5px;">
//         ${cat.name}
//         <button onclick="startEditCategory(${cat.id_categories}, '${cat.name.replace(/'/g, "\\'")}')">Edit</button>
//         <button onclick="deleteGlobalCategory(${cat.id_categories})">Delete</button>
//       </div>
//     `;
//     });
// }

// function startEditCategory(id, name) {
//     editCategoryId = id;
//     document.getElementById("newCategoryName").value = name;
//     document.getElementById("categorySubmitBtn").innerText = "Update Category";
//     document.getElementById("categoryCancelBtn").style.display = "inline-block";
// }

// function cancelEditCategory() {
//     editCategoryId = null;
//     document.getElementById("newCategoryName").value = "";
//     document.getElementById("categorySubmitBtn").innerText = "Add Category";
//     document.getElementById("categoryCancelBtn").style.display = "none";
// }

// async function submitCategory() {
//     const nameInput = document.getElementById("newCategoryName");
//     const name = nameInput.value;
//     if (!name) return;

//     if (editCategoryId) {
//         await fetch(`${BASE_URL}/admin/categories/${editCategoryId}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify({ name: name })
//         });
//         cancelEditCategory();
//     } else {
//         await fetch(`${BASE_URL}/admin/categories`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify({ name })
//         });
//         nameInput.value = "";
//     }
//     getGlobalCategories();
// }

// async function deleteGlobalCategory(id) {
//     if (!confirm("Delete this global category?")) return;
//     await fetch(`${BASE_URL}/admin/categories/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     getGlobalCategories();
// }

// function generateReport() {
//     window.print();
// }

// function logout() {
//     localStorage.clear();

//     window.location.href =
//         "home.html";
// }

// getStats();
// getTasks();
// getOverdueTasks();
// getGlobalCategories();

const BASE_URL =
    "http://localhost:5000/api";

const token =
    localStorage.getItem(
        "token"
    );

// CATEGORY EDIT STATE
let editCategoryId =
    null;

// =====================
// GLOBAL OVERVIEW
// =====================
async function getOverview() {

    try {

        const response =
            await fetch(
                `${BASE_URL}/statistics/global`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        const data =
            await response.json();

        console.log(data);

        const productivity =
            data.total_tasks > 0
                ? (
                    (
                        data.on_time /
                        data.total_tasks
                    ) * 100
                ).toFixed(1)
                : 0;

        document.getElementById(
            "overviewBox"
        ).innerHTML = `
            <p>
                Total Users:
                ${data.total_users}
            </p>

            <p>
                Total Tasks:
                ${data.total_tasks}
            </p>

            <p>
                On Time:
                ${data.on_time}
            </p>

            <p>
                Pending:
                ${data.pending}
            </p>

            <p>
                Overdue:
                ${data.overdue}
            </p>

            <h3>
                Productivity:
                ${productivity}%
            </h3>
        `;

    } catch (error) {

        console.error(error);

        document.getElementById(
            "overviewBox"
        ).innerHTML =
            "Failed to load overview";
    }
}

// =====================
// USER TABLE
// =====================
async function getUserStats() {

    const response =
        await fetch(
            `${BASE_URL}/statistics/users`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    const users =
        await response.json();

    const table =
        document.getElementById(
            "userStatsTable"
        );

    table.innerHTML = "";

    users.forEach(
        (
            user,
            index
        ) => {

            table.innerHTML += `
                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${user.username}
                    </td>

                    <td>
                        ${user.email}
                    </td>

                    <td>
                        ${user.total_tasks}
                    </td>

                    <td>
                        ${user.on_time}
                    </td>

                    <td>
                        ${user.overdue}
                    </td>

                    <td>
                        ${user.pending}
                    </td>

                    <td>
                        ${user.total_tasks > 0
                    ? (
                        (
                            user.on_time /
                            user.total_tasks
                        ) * 100
                    ).toFixed(1)
                    : 0
                }%
                    </td>

                    <td>

                        <button
                            onclick="
                                downloadUserPDF(
                                    ${user.id_users}
                                )
                            "
                        >
                            PDF
                        </button>

                    </td>

                </tr>
            `;
        }
    );
}

// =====================
// DOWNLOAD GLOBAL PDF
// =====================
async function downloadGlobalPDF() {

    const response =
        await fetch(
            `${BASE_URL}/statistics/pdf/global`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    const blob =
        await response.blob();

    const url =
        window.URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href = url;

    a.download =
        "global-report.pdf";

    document.body.appendChild(
        a
    );

    a.click();

    a.remove();
}

// =====================
// DOWNLOAD USER PDF
// =====================
async function downloadUserPDF(
    id
) {

    const response =
        await fetch(
            `${BASE_URL}/statistics/pdf/user/${id}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    const blob =
        await response.blob();

    const url =
        window.URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href = url;

    a.download =
        `user-${id}.pdf`;

    document.body.appendChild(
        a
    );

    a.click();

    a.remove();
}

// =====================
// GLOBAL CATEGORY
// =====================
async function getGlobalCategories() {

    const response =
        await fetch(
            `${BASE_URL}/admin/categories`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    const categories =
        await response.json();

    const container =
        document.getElementById(
            "categoriesList"
        );

    container.innerHTML =
        "";

    categories.forEach(
        (cat) => {

            container.innerHTML += `
                <div
                    style="
                        margin-bottom: 8px;
                    "
                >

                    ${cat.name}

                    <button
                        onclick="
                            startEditCategory(
                                ${cat.id_categories},
                                '${cat.name.replace(/'/g, "\\'")}'
                            )
                        "
                    >
                        Edit
                    </button>

                    <button
                        onclick="
                            deleteGlobalCategory(
                                ${cat.id_categories}
                            )
                        "
                    >
                        Delete
                    </button>

                </div>
            `;
        }
    );
}

// START EDIT CATEGORY
function startEditCategory(
    id,
    name
) {

    editCategoryId =
        id;

    document.getElementById(
        "newCategoryName"
    ).value =
        name;

    document.getElementById(
        "categorySubmitBtn"
    ).innerText =
        "Update Category";

    document.getElementById(
        "categoryCancelBtn"
    ).style.display =
        "inline-block";
}

// CANCEL EDIT
function cancelEditCategory() {

    editCategoryId =
        null;

    document.getElementById(
        "newCategoryName"
    ).value =
        "";

    document.getElementById(
        "categorySubmitBtn"
    ).innerText =
        "Add Category";

    document.getElementById(
        "categoryCancelBtn"
    ).style.display =
        "none";
}

// ADD / UPDATE CATEGORY
async function submitCategory() {

    const nameInput =
        document.getElementById(
            "newCategoryName"
        );

    const name =
        nameInput.value.trim();

    if (!name) {
        alert(
            "Category name required"
        );
        return;
    }

    try {

        // UPDATE
        if (
            editCategoryId
        ) {

            await fetch(
                `${BASE_URL}/admin/categories/${editCategoryId}`,
                {
                    method:
                        "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body:
                        JSON.stringify({
                            name,
                        }),
                }
            );

            cancelEditCategory();

        } else {

            // CREATE
            await fetch(
                `${BASE_URL}/admin/categories`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body:
                        JSON.stringify({
                            name,
                        }),
                }
            );

            nameInput.value =
                "";
        }

        getGlobalCategories();

    } catch (
    error
    ) {

        console.error(
            error
        );

        alert(
            "Failed category action"
        );
    }
}

// DELETE CATEGORY
async function deleteGlobalCategory(
    id
) {

    const yes =
        confirm(
            "Delete this category?"
        );

    if (!yes)
        return;

    try {

        await fetch(
            `${BASE_URL}/admin/categories/${id}`,
            {
                method:
                    "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

        getGlobalCategories();

    } catch (
    error
    ) {

        console.error(
            error
        );

        alert(
            "Failed delete category"
        );
    }
}

// =====================
// LOGOUT
// =====================
function logout() {

    localStorage.clear();

    window.location.href =
        "home.html";
}

// =====================
// INIT
// =====================
getOverview();
getUserStats();
getGlobalCategories();