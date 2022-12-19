let body = document.querySelector("body");

let btnAddTask = document.getElementById("btnAddTask");
let inputs = document.querySelectorAll("input[name=inputTask]");
let form = document.querySelector("form");
let toast = document.getElementById("toast");
// B) just styling stuff
// after focus styling
// inputs.forEach((input) => {
//     btnAddTask.addEventListener("submit", () => {
//      if(input.value.trim() !== "") {
//         input.nextElementSibling.classList.add("after-focus");
//      }else {
//         input.nextElementSibling.classList.remove("after-focus");
//       }

//     });
// });


// A ) ACTUAL IMPORTANT STUFF :
// 1) Assurer de definir la variable taskArray en tant que tableau dans mon fichier js
// ce array va contenir tous mes tasks individuels
//  + la condition assure son mode de remplissage a partir des data qui
// peuvent se trouver dans le local storage sous la cle TASKSTOCK

let taskArray;

if (localStorage.getItem("stockedTasks") == null) {
  taskArray = [];
} else {
  taskArray = JSON.parse(localStorage.getItem("stockedTasks"));
}

// 2) maintenant que mon tableau taskArray est defini, je gere le event
// du SUBMIT de tasks+dates

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let taskInput = form.elements["inputTask"];
  let dateInput = form.elements["inputDate"];

  // CONDITION PAR RAPPORT AU REMPLISSAGE DES INPUTS PAR LE USER
  if (taskInput.value.trim() !== "" && dateInput.value.trim() !== "") {
    // 2-1) si les inputs sont remplis cad ils ont une value !
    // cet objet ci dessous  sera cree sous le nom
    // de variable TASK, avec 2 proprietes CONTENT et DATE.
    let task = {
      content: taskInput.value,
      date: dateInput.value,
    };

    // 2-2) J ajoute mon objet js TASK dans mon tableau taskArray :
    taskArray.push(task);


    // 2-3) la je vais stocker mon objet dans mon local storage sous forme de
    // string characters en utilisant json stringify, sous la cle taskStock
    // voir APPLICATIONS dans inspecter du navigateur :
    localStorage.setItem("stockedTasks", JSON.stringify(taskArray));


    // 2-4) en utilisant un CALLBACK DE FONCTION "visibilityOfTask" definie ci dessous
    // Je vais AFFICHER le task DANS UNE <li> dans la liste pour etre visible au USER
    // + pouvoir ENLEVER le task (qui est dans une li)de la liste grace au remove
    // et  aussi enlever ce task du tableau grace au splice :
    visibilityOfTask(task, taskArray.length - 1);
       
    
    // 2-5) final step in this is to make sure after the input has been submitted
    // je vide les champs de la zone ou on ecrit . just to make things look clean
    taskInput.value = "";
    dateInput.value = "";
  } else {
    // ON AFFICHE UN TOAST AU USER PCQUE IL A PAS REMPLI LES CHAMPS NECESSAIRES
    toast.classList.remove("hide");
    setTimeout(() => {
        // apres 3secondes, on fait disparaitre le toast automatiquement
        toast.classList.add("hide");
    }, 3000);
  }
});



// NB : LA FONCTION AVEC LAQUELLE ON FAIT UN CALLBACK PR AFFICHAGE ET SUPRESSION
// DU TASK (les task etant mis dans les li visibles au user)

function visibilityOfTask(task, taskIndex = 0) {
  // create the <li>
  let li = document.createElement("li");

  // create the <SPAN> inside a <li> FOR THE TASK
  let spanContent = document.createElement("span");
  spanContent.textContent = task.content;
  spanContent.className = "taskAdded added";
  

  // create the <SPAN> inside a <li> FOR THE DATE
  let spanDate = document.createElement("span");
  spanDate.textContent = task.date;
  spanDate.className = "dateAdded added";

  // create the <button> to delete ONE task
  let btnDelete = document.createElement("button");
  // giving the button its style using existing classes in my css
  btnDelete.className = "btn btn-delete clear";
  btnDelete.innerHTML = "<i class='bx bx-trash-alt' ></i>";

  // event listener on this delete button avec fonction flechee a l interieur
  btnDelete.addEventListener("click", () => {
    if (confirm("Are you sure to delete this task?")) {
      btnDelete.parentElement.remove(); // supprime le <li> cad juste on efface le texte qui est visible par le user, sur la liste dans la page
      taskArray.splice(position, 1); // j enleve ce meme task qui est stockee comme objet dans le tableau taskArray

      localStorage.setItem("stockedTasks", JSON.stringify(taskArray)); // je dois refaire le setItem en uilisant un stringify JSON sur mon tableau taskArray vu que dans l etape precedent, je viens de modifier ce meme tableau dans mon fichier JS mais pas dans le local storage.
    }
  });
// APPEND ALL THE ELEMENTS TO EACHOTHER 
li.append(spanContent, spanDate, btnDelete);
document.querySelector("ul").append(li);
}


// FUNCTION FOR DELETING ALL TASKS AT ONCE 
function deleteAllTasks() {
    // using the KEY which is stockedTasks, i can delete ALL the objects stocked inside of it using .removeItem
    localStorage.removeItem("stockedTasks");

    // setting the array in my js to be empty again so i dont have to necessarily refresh the page to see the effect of the DELETE ALL
    taskArray = [];
    // emptying the visible ul list to the user so he doesnt have to necessaerily refresh to see the effect of the clear all
    document.querySelector(".taskList").innerHTML = "";
};

document.getElementById("clearAll").addEventListener("click", () => {
    if (confirm("are you sure you want to delete all tasks?")) {
        deleteAllTasks();
    }
});

// Display element of the list
for (let i = 0; i < taskArray.length; i++) {
    // remplir le tableau a chaque fois en parcourant une boucle
    visibilityOfTask(taskArray[i], i);
  }
