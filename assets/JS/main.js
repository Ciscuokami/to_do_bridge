// Crear tarea

async function createTask() {
    const form = document.getElementById("createTask");
    var obj = {};
    for (var i = 0; i < form.elements.length; i++) {
        var item = form.elements.item(i);
        obj[item.name] = item.value;
    }
    const response = await fetch("http://localhost:8080/task", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
}