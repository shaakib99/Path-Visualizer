const bfs = (agent,target,matrix) =>{
    matrix[agent.x][agent.y] = {
        id: agent,
        parentNode: null,
    }
    matrix[target.x][target.y] = {
        id: target,
        parentNode: null,
    }
    let q = []
    let qIndex =  -1
    let parent = agent
    while(q.length > qIndex && matrix[target.x][target.y].parentNode === null){
        findBFSNeighbours(q,parent,matrix)
        qIndex++
        if(q[qIndex] !== undefined){
            parent = {
                x: q[qIndex][0],
                y: q[qIndex][1]
            }
        }else
            break
        // console.log('parent',parent,qIndex,q)
    }
    let time = 0
    q.forEach((arr)=>{
        arr = {
            x: arr[0],
            y: arr[1]
        }
        const id = document.getElementById(matrixToId(arr))
        drawPath.push(setTimeout(()=> id.style.backgroundColor = agentBackgroundColor, time))
        time += 50
    })
    let tempMat = target
    while(matrix[tempMat.x][tempMat.y].parentNode !== null){
        const id = document.getElementById(matrixToId(tempMat))
        drawPath.push(setTimeout(()=> id.style.backgroundColor = targetBackgroundColor,time))
        time += 50
        tempMat = matrix[tempMat.x][tempMat.y].parentNode
    }
}

const findBFSNeighbours = (q,parent,matrix) =>{
    if(q.length == 0){
        parent = [parent.x,parent.y]
        q.push(parent)
    }else{
        const twelve = [parent.x - 1, parent.y]
        const one = [parent.x - 1, parent.y + 1]
        const three = [parent.x, parent.y + 1]
        const five = [parent.x  + 1, parent.y + 1]
        const six = [parent.x + 1, parent.y]
        const seven = [parent.x + 1, parent.y - 1]
        const nine = [parent.x , parent.y - 1]
        const ten = [parent.x - 1, parent.y - 1]

        // const coords = [twelve,one,three,five,six,seven,nine,ten]
        const coords = [twelve,three,six,nine]

        coords.forEach(coord => {
            const coordPositive = coord[0] >= 0 && coord[0] < gridRow && coord[1] >= 0 && coord[1] < gridCol ? true : false
            const coordMappable = coordPositive && matrix[coord[0]][coord[1]].blocked !== blocked ? true : false
            const notInQueuse = coordMappable && !coordFoundInQ(q,coord) ? true : false
            
            if(notInQueuse){
                q.push(coord)

                coord = {
                    x: coord[0],
                    y: coord[1]
                }
                matrix[coord.x][coord.y] = {
                    id: coord,
                    parentNode: parent,
                }
            }
        });
    }
}

const coordFoundInQ = (q,coord) =>{
   i = 0;
   while(i<q.length){
       if(q[i][0] === coord[0] && q[i][1] === coord[1])
           return true
        i++
   }
}