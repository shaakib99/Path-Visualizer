const aStar = (agent,target,matrix) =>{
    let tempMatrixHolder = []
    matrix[agent.x][agent.y] = {
        id: agent,
        blocked: blocked,
        gcost: null,
        hcost: null,
        fcost: null,
        parentNode: null
    };
    matrix[target.x][target.y] = {
        id: target,
        blocked: !blocked,
        gcost: null,
        hcost: null,
        fcost: null,
        parentNode:null
    };
    let neighbours = [];
    let parent = agent;
    const maxIteration = 50;
    let countIteration = 0; 
    // console.log(matrix[target.x][target.y])
    while(matrix[target.x][target.y].blocked === !blocked){
        const neighboursLength = neighbours.length

        const childs = findNeighbours(matrix, parent);
        neighbours = pushToNeightbours(neighbours,childs,parent,matrix,target);
        tempMatrixHolder.push(neighbours.slice())
        let lowestFcost = findLowestFCost(neighbours,matrix)
        lowestFcost = {
            x: lowestFcost[0],
            y: lowestFcost[1]
        }
        matrix[lowestFcost.x][lowestFcost.y].blocked = blocked;
        parent = lowestFcost;

        countIteration = neighboursLength === neighbours.length ? countIteration+1 : 0;
        if(countIteration>maxIteration)
            break
    }

    // Shortest Path
    let time = 0
    let index = 0
    tempMatrixHolder.forEach((n)=>{
        n = n.slice(index)
        n.forEach((num)=>{
            index++
            num = {
                x: num[0],
                y: num[1],
            }
            num = matrixToId(num)
            document.getElementById(num).style.backgroundColor === 'coral' ? time += 0 : time += 50
            drawPath.push(setTimeout(()=>document.getElementById(num).style.backgroundColor = 'coral', time))

        })
    })
    let tempParent = target
    while(matrix[tempParent.x][tempParent.y].parentNode !== null){
        const id = matrixToId(tempParent);
        time += 50
        drawPath.push(setTimeout(()=>document.getElementById(id).style.backgroundColor = targetBackgroundColor, time))
        tempParent = matrix[tempParent.x][tempParent.y].parentNode
    }
    
}

const findNeighbours = (matrix,place) =>{
    const twelveOClock = [place.x, place.y+1];
    const oneOClock = [place.x + 1, place.y  + 1];
    const threeOClock = [place.x + 1, place.y];
    const fiveOClock = [place.x + 1,place.y - 1];
    const sixOClock = [place.x,place.y-1];
    const eightOClock = [place.x-1,place.y-1];
    const nineOClock = [place.x-1, place.y];
    const tenOClock = [place.x - 1,place.y + 1];

    //const allCoords = [twelveOClock,oneOClock,threeOClock,fiveOClock,sixOClock,eightOClock,nineOClock,tenOClock];
    const allCoords = [twelveOClock,threeOClock,sixOClock,nineOClock]
    var tempArr = [];
    allCoords.forEach((coords)=>{
        const positiveCoords= coords[0] > -1 && coords[1] > -1 && coords[0] < gridRow && coords[1] < gridCol  ? true : false;
        const canReachCoords = positiveCoords && matrix[coords[0]][coords[1]].blocked !== blocked ? true : false
        if(canReachCoords)
            tempArr.push(coords)
    })

    return tempArr
}

const findGcost = (parent,child) =>{
    child = {
        x: child[0],
        y: child[1]
    }
    const returnValue = parent.x === child.x || parent.y === child.y ? 10 : 14;
    return returnValue;
}

const findHcost = (target,child)=>{
    let hcost = 0;
    child = {
        x: child[0],
        y: child[1]
    };
    while(child.x !== target.x || child.y !== target.y){
        const valueTobeAdded = child.x === target.x || child.y === target.y ? 10 : 14;
        if(child.x === target.x){}
        else if(child.x < target.x)
            child.x = child.x + 1;
        else
            child.x = child.x - 1;

        if(child.y === target.y){}
        else if(child.y < target.y)
            child.y = child.y + 1;
        else
            child.y = child.y - 1;
        hcost += valueTobeAdded
    }

    return hcost
}

const findFCost = (gCost,hCost) =>{
    let tempArr = []
    if(gCost.length === hCost.length){
       gCost.forEach((gcost,index) => tempArr.push(gCost[index] + hCost[index]));
    }
    return tempArr;
}

const pushToNeightbours = (neighbours,childs,parent,matrix,target) =>{
    childs.forEach((child) =>{
        // console.log(child)
        const gcost = matrix[parent.x][parent.y].gcost === null ?  findGcost(parent,child) : matrix[parent.x][parent.y].gcost + findGcost(parent,child);
        const hcost = findHcost(target,child);
        const fcost = gcost + hcost;

        child = {
            x: child[0],
            y: child[1],
        }
        const obj = {
            id: child,
            blocked: !blocked,
            gcost: gcost,
            hcost: hcost,
            fcost: fcost,
            parentNode: parent,

        }
        matrix[child.x][child.y] = matrix[child.x][child.y].fcost < fcost ? matrix[child.x][child.y] : obj
        if(child.x === target.x && child.y === target.y) {
            matrix[child.x][child.y] = obj
        }
        !findDuplicate(neighbours.slice(),child) ? neighbours.push([child.x,child.y]) : null;
        })

    return neighbours;
}

const findLowestFCost = (neighbours,matrix) =>{
    let tempArr = []
    neighbours.forEach((neighbour) =>{
        neighbour = {
            x: neighbour[0],
            y: neighbour[1]
        }
        if(!matrix[neighbour.x][neighbour.y].blocked){
            tempArr.push(matrix[neighbour.x][neighbour.y].fcost)
        }else{
            tempArr.push(99999)
        }
    })
    const index = tempArr.findIndex((num) => num === findMinValue(tempArr));
    return neighbours[index];
}

const findMinValue = (arr)=>{
    let min = arr[0]
    for(var i=0;i<arr.length;i++){
        if(arr[i + 1] !== undefined){
            if(min > arr[i+1]){
                min = arr[i+1]
            }
        }
    }
    return min
}

const findDuplicate = (neightbours, child) =>{
    let found = false;
    i = 0;
    while(i<neightbours.length){
        // console.log('neig',neightbours[i],child)
        if(neightbours[i][0] === child.x && neightbours[i][1] === child.y){
            found = true;
            break
        }
        i++;
    }
    return found
}