const gridRow = 20; // Don't change it
const gridCol = 30
const timeToDrawEachBox = 0.5; //ms
const listClassName = 'list-box';
const agentBackgroundColor = 'coral';
const targetBackgroundColor = 'teal';
const selectedBackgroundColor = 'rgb(33, 149, 226)';
const blocked = true;
const visited = true;
var agentSelected = false;
var targetSelected = false;
var agentId = null;
var targetId = null;
let algortihmIndex = -1;
let drawPath = []
let programStatus = 'waiting'

window.onload = () =>{
    const clearButton = document.getElementById('clear');
    const setAgentButton = document.getElementById('agent');
    const setTargetButton = document.getElementById('target');
    const ulId = document.getElementById('boxes');
    const startPathFindingButton = document.getElementById('right-side');
    const showAlgorithmButton = document.getElementById('select-algorithm')

    startPathFindingButton.addEventListener('click',()=>{
        startPathFindingButton.disabled = true
        if(targetId === null || agentId === null){
            targetId === null ? flashId(setTargetButton) : flashId(setAgentButton);
        }else{
            let matrix = makeMatrix();

            const agent = listIdToCoords(agentId)
            const target = listIdToCoords(targetId)
            programStatus = 'running'
            if(algortihmIndex === 0 )
                aStar(agent,target,matrix)
            else if(algortihmIndex === 1)
                dijktra(agent,target,matrix)
            else if(algortihmIndex === 2)
                bfs(agent,target,matrix)
            else if(algortihmIndex === -1){
               let i = 0;
               const range = 3
               let time = 0
               while(i<range){
                    setTimeout(()=>showAlgorithmButton.style.opacity = 0 ,time)
                    time += 100
                    setTimeout(()=>showAlgorithmButton.style.opacity = 1 ,time)
                    time += 100
                    i++
               }
            }
        }
    })


    clearButton.addEventListener('click',()=>{
        drawPath.forEach((d)=> clearTimeout(d))
        programStatus = 'waiting'
        startPathFindingButton.disabled = false
        ulId.innerHTML = '';
        targetId = null;
        agentId = null;
        drawBoxes(gridRow * gridCol);
    });

    setAgentButton.addEventListener('click',()=>{
        targetSelected = false;
        agentSelected = agentSelected ? false : true;

        styleOnButtonSelected(agentSelected,targetSelected,setAgentButton,setTargetButton);
    });
    setTargetButton.addEventListener('click',()=>{
        agentSelected = false;
        targetSelected = targetSelected ? false : true;

        styleOnButtonSelected(agentSelected,targetSelected,setAgentButton,setTargetButton);
    });

    showAlgorithmButton.addEventListener('click',()=>{
        const showAlgorithmList = document.getElementById('algorithm-list')
        showAlgorithmList.style.display = showAlgorithmList.style.display === 'flex' ? 'none' : 'flex' ;
    })

    // Draw boxes on load
    drawBoxes(gridRow * gridCol);

}

const setAlgorithmIndex = (index) =>{
    const showAlgorithmList = document.getElementById('algorithm-list')
    const algorithmName = document.getElementById('algortihm-name')
    const ulId = document.getElementById('boxes');
    showAlgorithmList.style.display = 'none'

    if(index >=0){
        algortihmIndex = index;
        if(index === 0)
            algorithmName.innerHTML = 'A* Algorithm'
        else if(index === 1)
            algorithmName.innerHTML = 'Dijktras Algorithm'
        else if(index === 2)
            algorithmName.innerHTML = 'BFS'
    }
    drawPath.forEach((d)=> clearTimeout(d))
    programStatus = 'waiting'
    ulId.innerHTML = '';
    targetId = null;
    agentId = null;
    drawBoxes(gridRow * gridCol);
}

const drawBoxes = (numberOfBox) =>{
    const videoId = document.getElementById('tutorial')
    videoId.style.display = 'none'
    const ulId = document.getElementById('boxes');
    ulId.addEventListener('mouseleave',removeEventListener);
    let timeCounter = 0
    for(var i=0; i<(gridRow * gridCol); i++){
        const list = document.createElement('li');
        list.className = listClassName;
        list.id = i;

        timeCounter = i * timeToDrawEachBox
        setTimeout(()=>{
            drawAndAddListener(ulId,list)
        }, i* timeToDrawEachBox)
    }

    setTimeout(()=>{
        videoId.style.display = 'flex'
    },timeCounter + 10)
}

const drawAndAddListener = (ulId,list) =>{
    ulId.appendChild(list);

    list.addEventListener('mousedown',()=>{
        if(programStatus === 'waiting'){
            if(!agentSelected && !targetSelected){
                const backgroundColor = list.style.backgroundColor
                const placeIsOccupied = backgroundColor === agentBackgroundColor || backgroundColor === targetBackgroundColor
                
                list.style.backgroundColor = !placeIsOccupied ? selectedBackgroundColor : backgroundColor
                
                // Add mouseover Listener to all boxes
                addMouseoverListener();
            }else{
                setIdAndColor(list,agentSelected,targetSelected);
            }
        }
    });

    list.addEventListener('mouseup',() =>{
        removeEventListener()
    });
}

const addMouseoverListener = ()=>{
    const allBoxes = document.getElementsByClassName(listClassName);

    for(var i=0;i<allBoxes.length;i++){
        const box = allBoxes[i];
        box.addEventListener('mouseover',onMouseOver)
    }
}

const onMouseOver = (boxProperty)=>{
    const id = boxProperty.target.id;
    const element = document.getElementById(id);
    const backgroundColor = element.style.backgroundColor;

    element.style.backgroundColor = id !== agentId && id !== targetId ? selectedBackgroundColor : backgroundColor
}

const removeEventListener = () =>{
    const allBoxes = document.getElementsByClassName(listClassName);

    for(var i=0;i<allBoxes.length;i++){
        const box = allBoxes[i];
        box.removeEventListener('mouseover',onMouseOver)
    }
}

const styleOnButtonSelected = (agentSelected,targetSelected,agentButton,targetButton) =>{
    if(agentSelected){
        agentButton.style.opacity = '0.5'
        targetButton.style.opacity = '1';
    }
    else if(targetSelected){
        agentButton.style.opacity = '1'
        targetButton.style.opacity = '0.5';
    }
    else{
        agentButton.style.opacity = '1'
        targetButton.style.opacity = '1';
    }
}

const setIdAndColor = (list,agentSelected,targetSelected) =>{
    if(agentSelected){
        if(agentId === null){
            agentId = list.id;
            aId = document.getElementById(agentId);
            aId.innerHTML = 'A';
            aId.style.backgroundColor = agentBackgroundColor;
        }
        else{
            let aId = document.getElementById(agentId);
            aId.style.backgroundColor = '';
            aId.innerHTML = '';

            agentId = list.id;
            aId = document.getElementById(agentId);
            aId.innerHTML = 'A';
            aId.style.backgroundColor = agentBackgroundColor;

            targetId = targetId === agentId ? null : targetId;
        }
    }else if(targetSelected){
        if(targetId === null){
            targetId = list.id;
            aId = document.getElementById(targetId);
            aId.innerHTML = 'T';
            aId.style.backgroundColor = targetBackgroundColor;
        }
        else{
            let aId = document.getElementById(targetId);
            aId.style.backgroundColor = '';
            aId.innerHTML = '';

            targetId = list.id;
            aId = document.getElementById(targetId);
            aId.innerHTML = 'T';
            aId.style.backgroundColor = targetBackgroundColor;

            agentId = agentId === targetId ? null : agentId;
        }
    }
}

const flashId = (divId) =>{
    const flashTime = 3;
    var time = 0 //ms
    for(var i=0;i<flashTime;i++){
        setTimeout(()=> divId.style.opacity = 0,time);
        time += 100;
        setTimeout(()=>divId.style.opacity = 1, time);
        time += 100;
    }
}

const makeMatrix = () =>{
    var matrix = create2DMatrix(gridRow,gridCol)
    const allBoxes = document.getElementsByClassName(listClassName)
    let row = 0;
    let col = 0;
    const itemPerRow = gridCol ;
    for(var i=0;i<allBoxes.length;i++){
        const box = allBoxes[i];
        const x = box.style.backgroundColor === selectedBackgroundColor ? blocked : !blocked
        matrix[row][col] =  {
            blocked: x
        }

        col++;
        row = col === itemPerRow ? row + 1 : row;
        col = col === itemPerRow ? 0 : col;
    }
    return matrix
}

const create2DMatrix = (row,col) =>{
    var matrix = [];
    for(var i=0;i<row;i++){
        let tempMatrix = []
        for(var j=0;j<col;j++){
            tempMatrix.push(-1)
        }
        matrix.push(tempMatrix)
    }

    return matrix
}

const matrixToId = (xy) =>{
    return xy.x * 30 + xy.y 
}

const listIdToCoords = (id) =>{
    const row = Math.floor(id / gridCol);
    const minCol = row * gridCol;
    const col = id - minCol

    return {
        x: row,
        y:col
    }
}