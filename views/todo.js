var ul = document.getElementById('list')    //line 1
var li;
var addButton = document.getElementById('add')  //line 2
addButton.addEventListener("click",addItem)

function addItem(){                         //line 3
    var input = document.getElementById('input')        //line 4
    var item = input.value;             //line 5    
    var textNode = document.createTextNode(item)    //line 6
    if (item == '') {       //line 7
        msg= "Enter your Task"
        alert(msg)
        return false
        
    } else {                //line 8
        li = document.createElement('li')       //line 9
        let checkbox = document.createElement('input')         //line 10
        checkbox.type = 'checkbox'              //line 11
        checkbox.setAttribute('id','check')         //line 12
       
        let label = document.createElement('label')         //line 13

        ul.appendChild(label)                       //line 14
        li.appendChild(checkbox)
        label.appendChild(textNode)
        li.appendChild(label)
        ul.insertBefore(li, ul.childNodes[0])
        setTimeout(()=>{
            li.className = 'visual'
        },5)
        input.value = " "               //line 15
    }
}

var removeButton = document.getElementById('remove')        //line 16
removeButton.addEventListener("click",removeItem)       //line 17

function removeItem(){              //line 18
    li=ul.children
    for (let index = 0; index < li.length; index++) {   //line 19
        const element = li[index];              //line 20
        while(li[index] && li[index].children[0].checked){      //line 21
            ul.removeChild(li[index])
        }
        
    }   
}