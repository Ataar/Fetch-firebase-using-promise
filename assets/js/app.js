
let userForm = document.getElementById('userForm')
let title = document.getElementById('title')
let body = document.getElementById('body')
let userId = document.getElementById('userId')
const postContainer =document.getElementById('postContainer')
const sBtn = document.getElementById('sBtn')
const uBtn = document.getElementById('uBtn')


let baseurl = 'https://fetch-practice-f1688-default-rtdb.asia-southeast1.firebasedatabase.app';


let posturl = `${baseurl}/posts.json`;

let creatUrl = (id)=>{
   return `${baseurl}/posts/${id}.json`;

}

// -------------------------------------------------
const objArr = (newObj)=>{
  let postArr = [];
  for(const key in newObj)
  {                                      // function to cinver obj into array
    let obj = newObj[key];
    obj.id = key;
    postArr.push(obj);
  }
  return postArr;
}
// ---------------------------------------------

const onEdit =(ele)=>{
  // console.log(ele);
  let editId = ele.closest('.card').id;
  localStorage.setItem('editId',editId)
  // console.log(editId);
  // let editUrl = `${baseurl}/posts/${editId}.json`;
  let editUrl  = creatUrl(editId)
  // console.log(editUrl);
  fetch(editUrl,{
    method:'GET',
    headers:{
      'Content-type':'application/json',
      'Accept':'application/json',
    }

  })
  .then(res=>{
    return res.json();
  })
  .then(data=>{
    console.log(data);
    
    Swal.fire({
        title: "Do you want to Edit?",
        icon: "warning",
     
    })
     sBtn.classList.add('d-none');
     uBtn.classList.remove('d-none');
    
    title.value = data.title;
    body.value = data.body;
    userId.value = data.userId;
  })
  .catch(err=>{
    console.log(err);
  })
 
}



 


let createPostCards = (newpost)=>{
  let card = document.createElement('div');
  card.className='card mb-4 mt-4 bg-dark text-white';
  card.id = newpost.id;
  card.innerHTML =`
  
  
  <div class="card-header">
  <h1 class= h5>${newpost.title}</h1>
  </div>
  <div class="card-body">
  <p>${newpost.body}</p>
  </div>
  <div class="card-footer d-flex justify-content-between">
   <button class="btn btn-primary" onclick='onEdit(this)'>Edit</button>
   <button class="btn btn-danger" onclick='onDelete(this)'>Delete</button>
  </div>
  `
  postContainer.prepend(card)

}



let onDelete=(eve)=>{
  console.log(eve);
  let deleteId = eve.closest('.card').id;
  // let deleteUrl = `${baseurl}/posts/${deleteId}.json`
  let deleteUrl = creatUrl(deleteId)
  let getConform = confirm(`Are you want to remove this post?`)
  if(getConform)
  {
    fetch(deleteUrl,{
    method:'DELETE',
    headers:{
      'Content-type':'application/json'
    }
  }) 
  .then(res=>{
    return res.json()
  })
  .then(add=>{
    console.log(add);
   document.getElementById(deleteId).remove()

  })
  .catch(err=>{
    console.log(err);
  })
  }
}

const templating = (arr)=>{
  postContainer.innerHTML = ``
   arr.forEach(post=>{
     createPostCards(post)
   })
}

// ---------------------------------------------------------------------------

fetch(posturl)
.then(res=>{
  return res.json()
})                               // code for api call
.then(data=>{
  console.log(data);
  let postArr = objArr(data)
  templating(postArr)
})

.catch(err=>console.log(err))

// -----------------------------------------------------
  
   // TO Submit a from and creat object

const onpost=(ele)=>{
  ele.preventDefault()
  let postobj = 
  {
    title :title.value,
    body: body.value,
   userId:userId.value
  }
  // console.log(postobj);
  fetch(posturl,{
    method:'POST',
    body : JSON.stringify(postobj),
    headers :{
      'Content-type':'application/json',
    }
  })
  .then(res=>{
    return res.json()
  })
  .then(data=>{
    // console.log(data);
    postobj.id =data.name;
    createPostCards(postobj)
  })
  
.catch(err=>{
  console.log(err);
})
 
   
}

const onUpdate = ()=>{
  let updateId = localStorage.getItem('editId')
  let updateobj = {
    title : title.value,
    body : body.value,
     userId : userId.value,
  }
  console.log(updateobj);

  // let updateUrl = `${baseurl}/posts/${updateId}.json`
  let updateUrl = creatUrl(updateId)
  console.log(updateUrl);
  fetch(updateUrl,{
    method:'PATCH',
    body:JSON.stringify(updateobj),
    headers :{
      'Content-type':"application/json"
    }
  })
  .then(res=>{
    return res.json()
  })
  .then(data=>{
    console.log(data);
    Swal.fire({
      title:'Done Succesfully',
      icon: "Success",
      text:'Post has been Updated'
   
  })    
  })
  .catch(err=>{
    console.log(err);
  })
  .finally(()=>{
    userForm.reset()
    uBtn.classList.add('d-none')
    sBtn.classList.remove('d-none');
  
  })
}

userForm.addEventListener('submit',onpost) // call-back function will give object when the user submit a form.
uBtn.addEventListener('click',onUpdate)
//-----------------------------------------