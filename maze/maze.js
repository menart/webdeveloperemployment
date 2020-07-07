function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let maze = [
    //1   2    3    4    5    6    7    8    9    10
    [0x3, 0xC, 0x6, 0x6, 0x2, 0x6, 0x2, 0x2, 0x6, 0x4], //1
    [0x9, 0x8, 0x0, 0x4, 0x4, 0x4, 0x4, 0x4, 0x4, 0x4], //2
    [0x1, 0x0, 0xC, 0x4, 0x4, 0x4, 0x4, 0x4, 0x4, 0x4], //3
    [0x5, 0xC, 0x4, 0x8, 0xC, 0x4, 0x4, 0x4, 0xC, 0x4], //4
    [0x1, 0x8, 0xC, 0x0, 0x8, 0xC, 0x4, 0x8, 0x4, 0x4], //5
    [0x9, 0x8, 0x8, 0x8, 0x8, 0x8, 0xC, 0x0, 0xC, 0x4], //6
    [0x1, 0x0, 0x0, 0x4, 0x0, 0x8, 0x8, 0xC, 0x0, 0x4], //7
    [0x5, 0x4, 0x4, 0x4, 0x8, 0x8, 0x8, 0x0, 0xC, 0x4], //8
    [0x5, 0xC, 0xC, 0x8, 0x8, 0x0, 0x8, 0x8, 0xC, 0x4], //9
    [0x9, 0x8, 0x8, 0x8, 0xC, 0x8, 0x8, 0x8, 0xC, 0xC] //10
];

let way = [];

const MAZE_SIZE = [10, 10];

const MOVE_LEFT = [-1, 0];
const MOVE_RIGHT = [1, 0];
const MOVE_TOP = [0, 1];
const MOVE_BOTTOM = [0, -1];

let start = [1, 0];
let finish = [9, 0];

const in_array = (arr, el) => {
    for (let i = 0; i < arr.length; i++) {
        if (el[0] == arr[i][0] && el[1] == arr[i][1])
            return true;
    }
    return false;
}

const init = () => {

    //массив - лабиринт
    //0 бит левая стенка
    //1 бит верхняя стенка
    //2 бит правая стенка
    //3 бит нижняя стенка

    let table_maze = document.querySelector('.maze');

    for (let i = 0; i < 10; i++) {
        let tr = document.createElement('tr');
        tr.id = 'row' + (i + 1);
        for (let j = 0; j < 10; j++) {
            let td = document.createElement('td');
            if ((maze[i][j] & 1) === 1) td.classList.add('left');
            if ((maze[i][j] & 2) === 2) td.classList.add('top');
            if ((maze[i][j] & 4) === 4) td.classList.add('right');
            if ((maze[i][j] & 8) === 8) td.classList.add('bottom');
            td.id = 'r' + i + 'c' + j;
            // td.innerText = td.id;
            tr.append(td);
        }
        table_maze.append(tr);
    }

}

const checkWay = (point, delta) => {

    let x = point[0],
        y = point[1],
        dx = delta[0],
        dy = delta[1];

    // вышли за пределы лабиринта
    if ((x + dx) < 0 || (y + dy) < 0) return false;
    if ((x + dx) > MAZE_SIZE[0] || (y + dy) > MAZE_SIZE[1]) return false;

    //Движение по диагонали
    if (dx != 0 && dy != 0) return false;
    //Нет движения
    if (dx == 0 && dy == 0) return false;
    //Движение более одной клетки
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) return false;

    let cell = document.querySelector('#r' + y + 'c' + x);
    let dcell = document.querySelector('#r' + (y + dy) + 'c' + (x + dx));

    if (dx > 0)  //ход направо
        return !(cell.classList.contains('right') || dcell.classList.contains('left'));

    if (dx < 0)  //ход налево
        return !(cell.classList.contains('left') || dcell.classList.contains('right'));

    if (dy > 0)  //ход вниз
        return !(cell.classList.contains('bottom') || dcell.classList.contains('top'));

    if (dy < 0)  //ход вверх
        return !(cell.classList.contains('top') || dcell.classList.contains('bottom'));

}

const checkPoint = (point) => {
    return (point[0] == finish[0] && point[1] == finish[1]);
}

const getPoint = (oldPoint, move, sendWay) => {
    let cell = document.querySelector('#r' + oldPoint[1] + 'c' + oldPoint[0]);

    cell.classList.add('go');

    if (checkWay(oldPoint, move)) {

        let point = [];
        point.push(oldPoint[0] + move[0]);
        point.push(oldPoint[1] + move[1]);

        console.log(point, sendWay, sendWay.indexOf(point) === -1);

        if (!in_array(sendWay, point)) {

            let arrWay = sendWay.slice(0);
            arrWay.push(point);

            if (checkPoint(point))
                way.push(arrWay.slice(0));
            else
                getWay(arrWay);
        }
    }

    cell.classList.remove('go');
}


const getWay = (arrWay) => {
    let point = [],
        dx = 0, dy = 0;
    if (arrWay.length > 0) {
        point = arrWay[arrWay.length - 1];
    }

    if (arrWay.length > 1) {
        dx = arrWay[arrWay.length - 2][0] - point[0];
        dy = arrWay[arrWay.length - 2][1] - point[1];
    }

    if (!(dx == -1 && dy == 0)) getPoint(point, MOVE_LEFT, arrWay);
    if (!(dx == 1 && dy == 0)) getPoint(point, MOVE_RIGHT, arrWay);
    if (!(dx == 0 && dy == -1)) getPoint(point, MOVE_BOTTOM, arrWay);
    if (!(dx == 0 && dy == 1)) getPoint(point, MOVE_TOP, arrWay);

}

const runOutMaze = () => {
    let td = document.querySelector('#r' + start[1] + 'c' + start[0]);
    td.classList.add('way');
    let x = start[0], y = start[1];
    getWay([start]);
    let outWay = document.querySelector('.outWay');
    let min = way[0].length;
    let minArray = 0;
    for (let i = 1; i < way.length; i++)
        if (min > way[i].length) {
            min = way[i].length;
            minArray = i;
        }
    for (let i = 0; i < way.length; i++) {
        let ul = document.createElement('ul');
        way[i].forEach(went => {
            let li = document.createElement('li');
            let cell = document.querySelector('#r' + went[1] + 'c' + went[0]);
            if (i == minArray){
                cell.classList.add('fast');
                li.classList.add('fast');
            }
            else
                cell.classList.add('go');
            li.innerText = ('-'+went[1] + ',' + went[0]+'-');
            ul.append(li);
        });
        outWay.append(ul);
    }
    //   way.length
}

init();
runOutMaze();