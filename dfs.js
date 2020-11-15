const dfs = (agent,target,matrix) =>{
    matrix[agent.x][agent.y] = {
        id: agent,
        visited:true,
        parentNode: null
    }
    matrix[target.x][target.y] = {
        id:target,
        parentNode:null,
    }
    let stack = []
    stack.push(agent)
    let stackIndex = 0
    let time = 0
    let stackHolder = []
    while(stack.length !== 0 && matrix[target.x][target.y].parentNode === null){
        checkNeighbour(stack,matrix,agent,target)
        stackHolder.push(stack.slice())
    }

    const maxIndex = findMaxIndex(stackHolder)
    console.log(stackHolder,maxIndex)
    stackHolder = stackHolder[findMaxIndex(stackHolder) - 1]
    stackHolder.forEach((s)=>{
        const id = document.getElementById(matrixToId(s))
        setTimeout(()=> id.style.backgroundColor = agentBackgroundColor, time)
        time += 50
    })

    let tempParent = target
    while(matrix[tempParent.x][tempParent.y].parentNode !== null){
        const id = document.getElementById(matrixToId(tempParent))
        setTimeout(()=>id.style.backgroundColor = targetBackgroundColor, time)
        time += 50
        tempParent = matrix[tempParent.x][tempParent.y].parentNode 
    }
}

const checkNeighbour = (stack,matrix,agent,target) =>{
    let parent = stack[stack.length - 1]

    const twelve = [parent.x - 1, parent.y]
    const one = [parent.x - 1, parent.y + 1]
    const three = [parent.x, parent.y + 1]
    const five = [parent.x  + 1, parent.y + 1]
    const six = [parent.x + 1, parent.y]
    const seven = [parent.x + 1, parent.y - 1]
    const nine = [parent.x , parent.y - 1]
    const ten = [parent.x - 1, parent.y - 1]

    // const coords = [twelve,one,three,five,six,seven,nine,ten]
    let coords =  []
    if(agent.x < target.x){
        // Target is on the right
        if(agent.y < target.y){
            //  target is below the agent
             coords = [three,six,nine,twelve]
        }else{
            coords = [three,twelve,nine,six]
        }
    }else{
        // Target is on the left
        if(agent.y < target.y){
            //  target is below the agent
            coords = [nine,six,three,twelve]
        }else{
            coords = [nine,twelve,three,six]
        }
    }
    let hasAtLeastOneNeighbour = false
    i = 0
    while(i< coords.length){
        // console.log(parent,i)
        coord = coords[i]
        const coordPositive = coord[0] >= 0 && coord[0] < gridRow && coord[1] >= 0 && coord[1] < gridCol ? true : false
        const coordMappable = coordPositive && matrix[coord[0]][coord[1]].blocked !== blocked ? true : false
        // const hasVisitedProperty = coordMappable && matrix[coord[0]][coord[1]].visited === undefined ? false : true
        if(coordMappable && matrix[coord[0]][coord[1]].visited === undefined ){
            hasAtLeastOneNeighbour = true
            coord = {
                x: coord[0],
                y: coord[1]
            }
            const data = {
                id: coord,
                visited:true,
                parentNode: parent,
            }
            matrix[coord.x][coord.y] = data
            stack.push(coord)
            break
        }
        i++
    }
    !hasAtLeastOneNeighbour ? stack.pop() : null
}

const drawStack = (stack,stackIndex,time) =>{
    while(stackIndex < stack.length){
        const id = document.getElementById(matrixToId(stack[stackIndex]))
        setTimeout(()=> id.style.backgroundColor = agentBackgroundColor,time)
        time += 50
        stackIndex++
    }
}

const findMaxIndex = (arr) =>{
    let i = 0
    let maxIndex= 0
    while(i < arr.length){
        if( arr[i].length > maxIndex)
            maxIndex = arr.length
        
        i++
    }
    return maxIndex
}