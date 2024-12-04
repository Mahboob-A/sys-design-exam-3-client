const API_BASE = "http://127.0.0.1:9090/api/v1/app/task/";

async function fetchTasks() {
  try {
    const response = await fetch(API_BASE);
    const result = await response.json();

    if (response.ok) {
      renderTasks(result.data); 
    } else {
      console.error("Error fetching tasks:", result.message);
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

// function renderTasks(tasks) {
//   const tasksContainer = document.getElementById("tasks");
//   tasksContainer.innerHTML = "";
//   tasks.forEach((task) => {
//     const taskItem = document.createElement("li");
//     taskItem.innerHTML = `
//       <h3>${task.title}</h3>
//       <p>${task.description || "No description"}</p>
//       <p><strong>Completed:</strong> ${task.is_completed ? "Yes" : "No"}</p>
//       <br>
//       <p><strong>ID:</strong> ${task.id}</p>
//       <p><strong>Created At:</strong> ${task.created_at}</p>
//       <p><strong>Updated At:</strong> ${task.updated_at}</p>
//     `;
//     tasksContainer.appendChild(taskItem);
//   });
// }

function renderTasks(tasks) {
  const tasksContainer = document.getElementById("tasks");
  tasksContainer.innerHTML = "";

  tasks.forEach((task) => {
    const createdAt = new Date(task.created_at).toLocaleString("en-US", {
      month: "short", 
      day: "2-digit", 
      year: "numeric", 
      hour: "2-digit", 
      minute: "2-digit", 
      hour12: true,
    });

    const updatedAt = new Date(task.updated_at).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description || "No description"}</p>
      <p><strong>Completed:</strong> ${task.is_completed ? "Yes" : "No"}</p>
      <br>
      <p><strong>ID:</strong> ${task.id}</p>
      <p><strong>Created At:</strong> ${createdAt}</p>
      <p><strong>Updated At:</strong> ${updatedAt}</p>
    `;
    tasksContainer.appendChild(taskItem);
  });
}


async function createTask() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;

  if (!title) {
    alert("Title is required!");
    return;
  }

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message); 
      fetchTasks();
    } else {
      console.error("Error creating task:", result.message);
    }

    document.getElementById("task-title").value = "";
    document.getElementById("task-desc").value = "";
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

async function updateTask() {
  const taskId = document.getElementById("update-id").value;
  const title = document.getElementById("update-title").value;
  const description = document.getElementById("update-desc").value;
  const isCompleted = document.getElementById("update-completed").checked;

  if (!taskId) {
    alert("Task ID is required to update!");
    return;
  }

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  updateData.is_completed = isCompleted; 

  try {
    await fetch(`${API_BASE}${taskId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    fetchTasks();
    alert("Task updated successfully!");
  } catch (error) {
    console.error("Error updating task:", error);
    alert("Failed to update the task.");
  }
}


async function deleteTask() {
  const taskId = document.getElementById("delete-id").value;

  if (!taskId) {
    alert("Task ID is required to delete!");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}${taskId}/`, { method: "DELETE" });
    const result = await response.json();

    if (response.ok) {
      alert(result.message); 
      fetchTasks();
    } else {
      console.error("Error deleting task:", result.message);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchTasks);
