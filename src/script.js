let allCategories = fetch("https://openapi.programming-hero.com/api/videos/categories")
  .then(response => response.json());

let data2 = null
let presentData = [];
let isSorted = false;
let isPresentedDrawingPart = false;

const SortByView = () => {

  if (isSorted || isPresentedDrawingPart) {
    return
  }
  presentData.sort(function (a, b) {
    return parseFloat(b.views.slice(0, -1)) - parseFloat(a.views.slice(0, -1))
  })
  document.getElementById("video-container").innerHTML = ""
  document.getElementById("no-data").innerHTML = ""

  isSorted = true

  presentData.forEach(details => {
    const card_container = document.createElement("div");

    card_container.innerHTML = `
        
        <div>
        <div class="card-container">
    
         <div class="" style="position: relative;">
           <img  src="${details.thumbnail}" class="card-img border-" alt="..." style="width: 290px; height: 200px;">
           <div class="card-img-overlay" style="position: absolute; top: 175px; left: 215px;">
               <small class="card-text" style="font-size: 10px; color: white">${convertTime(details.posted_date)}</small>
           </div>
   
         </div>
       </div>

       <div id="description-container" style="display: flex;">
           <div ><img id="profile" src="${details.profile_picture}" alt=""></div>
           <div id="video-description" style="padding-left: 18px;">${details.title}</div></div>
       </div>

       <div id="creater-container " class="d-flex " style="padding-left: 57px;">
         <div id="owner-part">${details.profile_name}</div>
         <div style="padding-left: 10px;" id="verififation-mark">${details.verification}</div>
       </div>
       <div id="views-container">${details.views}</div> 



     </div>
  

        `
    document.getElementById("video-container").appendChild(card_container)
  })


}

const setMenuBar = async () => {
  try {
    const data = await allCategories;
    document.getElementById("all").innerText = data.data[0].category;
    document.getElementById("music").innerText = data.data[1].category;
    document.getElementById("comedy").innerText = data.data[2].category;
    document.getElementById("drawing").innerText = data.data[3].category;

  }
  catch {
    error => console.log(error)
  }
};


const changeColor = () => {
  document.getElementById("all").classList.remove("changeColor");
  document.getElementById("music").classList.remove("changeColor");
  document.getElementById("comedy").classList.remove("changeColor");
  document.getElementById("drawing").classList.remove("changeColor");
}

const setColor = (id) => {
  document.getElementById(id).classList.add("changeColor")
}

const loadAllData = () => {
  changeColor()
  setColor("all")
  display_Data_by_Category_id(1000) 
}


const music = () => {
  changeColor()
  setColor("music")
  display_Data_by_Category_id(1001)
}
const comedy = () => {
  changeColor()
  setColor("comedy")
  display_Data_by_Category_id(1003)
}
const drawing = () => {
  changeColor()
  setColor("drawing")
  isPresentedDrawingPart = true
  display_Data_by_Category_id(1005)
}



const isVarified = (isVerificated) => {
  console.log("verification status", isVerificated)
  if (isVerificated) {
    return `<i class="fa-solid fa-circle-check"></i>`;
  }
  else {
    return ""
  }
}


const noDataMessage = () => {
  const content = document.getElementById("no-data")
  content.innerHTML = `      
  <div>
      <div class="img-part" style="padding-left: 35%;"><img src="./Icon.png" alt=""></div>
      <br>
      <div class="message-part"><h2>Oops!! Sorry, There is no content here</h2></div>

  </div>`

}


const display_Data_by_Category_id = async (id) => {
  try {
    document.getElementById("video-container").innerHTML = ""
    document.getElementById("no-data").innerHTML = ""
    let output = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
    output = await output.json();
    if (output.status == false) {
      noDataMessage();
      return;
    }
    isSorted = false;



    presentData = [];
    output.data.forEach(details => {
      object = {
        thumbnail: details.thumbnail,
        profile_picture: details.authors[0].profile_picture,
        title: details.title,
        profile_name: details.authors[0].profile_name,
        verification: isVarified(details.authors[0].verified),
        views: details.others.views,
        posted_date: details.others.posted_date
      }
      presentData.unshift(object);
      const card_container = document.createElement("div");

      card_container.innerHTML = `
        
        <div>
        <div class="card-container">
    
         <div class="" style="position: relative;">
           <img  src="${details.thumbnail}" class="card-img border-" alt="..." style="width: 290px; height: 200px;">
           <div class="card-img-overlay" style="position: absolute; top: 175px; left: 215px;">
               <small class="card-text" style="font-size: 10px; color: white">${convertTime(details.others.posted_date)}</small>
           </div>
   
         </div>
       </div>

       <div id="description-container" style="display: flex;">
           <div ><img id="profile" src="${details.authors[0].profile_picture}" alt=""></div>
           <div id="video-description" style="padding-left: 18px;">${details.title}</div></div>
       </div>

       <div id="creater-container " class="d-flex " style="padding-left: 57px;">
         <div id="owner-part">${details.authors[0].profile_name}</div>
         <div style="padding-left: 10px;" id="verififation-mark">${isVarified(details.authors[0].verified)}</div>
       </div>
       <div id="views-container">${details.others.views}</div> 
     </div>`
      document.getElementById("video-container").appendChild(card_container)
    })
  }
  catch {
    error => console.log(error)
  }

}

setMenuBar()
let trackForGlobal = 0;

if (trackForGlobal == 0) {
  trackForGlobal = 1;
  loadAllData();
}

const convertTime = (seconds) => {
  if (seconds == "") {
    return ""
  }
  else {
    seconds = parseInt(seconds);

    if (seconds <= 59) {
      return `${seconds} secs ago`
    }

    else if (seconds <= 60 * 60) {
      return `${parseInt(seconds / (60))} mins ago` // mins
    }

    else if (seconds <= 60 * 60 * 24) // mins and hour
    {
      return `${parseInt(seconds / (60 * 60))} hrs ${parseInt((seconds % (60 * 60)) / 60)} mins ago`
    }

    else if (seconds <= 60 * 60 * 24 * 365) {
      return `${parseInt(seconds / (60 * 60 * 24))} days ago`
    }

    else {
      return `${parseInt(seconds / (60 * 60 * 24 * 365))} years ago`
    }
  }

}

