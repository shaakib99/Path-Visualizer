const dijktra = (agent,target,matrix) =>{
    matrix[agent.x][agent.y] = {
        blocked:blocked,
        cost: 0,
        parentNode:null,
    }
    matrix[target.x][target.y] = {
        blocked:!blocked,
        parentNode:null
    }
    let parent = agent
    let neighbours = []
    const maxIteration = 50
    let countIter = 0
    let time = 0;
    let neighboursHolder = []
    while(matrix[target.x][target.y].parentNode === null){
        matrix[parent.x][parent.y].blocked = blocked

        const neighboursLen = neighbours.length

        neighbours = findDijktraNeighbours(neighbours,parent,matrix) // returns updated neighbour
        parent = findLowestCostNeighbour(neighbours,matrix)

        countIter = neighboursLen === neighbours.length ? countIter + 1 : 0;
        neighboursHolder.push(neighbours)

        if(countIter > maxIteration)
            break
    }

    neighbours.forEach((n)=>{
        const id = document.getElementById(matrixToId(n))
        if(id.style.backgroundColor !== targetBackgroundColor)
        drawPath.push(setTimeout(()=>id.style.backgroundColor = agentBackgroundColor, time))
        time += 50
    })

    parent = target
    while(matrix[parent.x][parent.y].parentNode !== null){
        time += 50
        const id = document.getElementById(matrixToId(parent))
        drawPath.push(setTimeout(()=> id.style.backgroundColor = targetBackgroundColor,time))
        parent = matrix[parent.x][parent.y].parentNode
    }
}

const findDijktraNeighbours = (neighbours, parent,matrix) =>{
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

    coords.forEach((coord)=>{
        const coordPositive = coord[0] >= 0 && coord[0] < gridRow && coord[1] >= 0 && coord[1] < gridCol ? true : false
        const coordMappable = coordPositive && matrix[coord[0]][coord[1]].blocked !== blocked ? true : false
        
        
        if(coordMappable){
            coord = {
                x: coord[0],
                y: coord[1],
            }

            const  data= {
                id: coord,
                blocked: !blocked,
                cost: matrix[parent.x][parent.y].cost + 10,
                parentNode: parent,
            }

            matrix[coord.x][coord.y] = matrix[coord.x][coord.y].cost < data.cost ? matrix[coord.x][coord.y] : data 
            
            !neighbourExist(coord,neighbours) ? neighbours.push(coord) : null
        }  
    })

    return neighbours
}

const neighbourExist = (coord,neighbours) => {
    let found = false
    neighbours.forEach((n)=>{
        if(n.x === coord.x && n.y === coord.y)
            found = true
            return found
    })
    return found
}

const findLowestCostNeighbour = (neighbours,matrix) =>{
    let lowestCost = {
        cost:999999999,
        index: null,
    };
    neighbours.forEach((n,index)=>{

        if(matrix[n.x][n.y].cost < lowestCost.cost && !matrix[n.x][n.y].blocked){
            lowestCost = {
                cost: matrix[n.x][n.y].cost,
                index : index,
            }
        }
    })

    return neighbours[lowestCost.index]
}