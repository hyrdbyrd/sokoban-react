# Sokoban-React
## Для запуска
```
npm start
```
После нужно зафокусить сам сокобан.
## Что касается кода...
Изучая React, решил побаловаться, результат на лицо (так себе).
## Компоненты
### Sokoban.js
В действительности, это и есть игра. Она уместилась в один файл. 
В измененных состояниях, я изменял массив со значениями 'p', 'w', 'e', '0', 'pe' *(player, wall, end, null, player **on end**)*.
Левела можно улучшать и увеличивать, при этом проверка победы будет работать. 
В действительности, весь функционал игры находиться внутри метода Sokoban.onKeyDown:
```js
onKeyDown (event) {
    const code = event.keyCode;
    const { levelsState, lvl } = this.state;

    const level = levelsState[lvl];
    let changed = false;

    const dir = {
        x: 0,
        y: 0
    }

    // arrow-down
    if (code === 40) {
        dir.y = 1;
    }
    // arrow-right
    if (code === 39) {
        dir.x = 1;
    }
    // arrow-top
    if (code === 38) {
        dir.y = -1;
    }
    // arrow-left
    if (code === 37) {
        dir.x = -1;
    }

    for (let y = 0; y < level.length && !changed; y++) {
        for (let x = 0; x < level[y].length && !changed; x++) {
            const [y1, x1, y2, x2] = [
                y + 1 * dir.y, 
                x + 1 * dir.x, 
                y + 2 * dir.y,
                x + 2 * dir.x
            ];
            if (level[y][x][0] === 'p') {
                const after = level[y][x][1] || '0';

                let next = level[y1];
                if (!next)
                    continue;

                next = next[x1];
                if (!next)
                    continue;

                if (next === '0') {
                    [level[y][x], level[y1][x1]] = [after, 'p'];
                } else if (next === 'b') {
                    let jumpTwo = level[y2];
                    if (!jumpTwo)
                        continue;

                    jumpTwo = jumpTwo[x2];
                    if (!jumpTwo)
                        continue;

                    if (jumpTwo === '0') {
                        [level[y][x], level[y1][x1], level[y2][x2]] = [after, 'p', 'b'];
                    } else if (jumpTwo === 'e') {
                        return this.setState({
                            levelsState,
                            lvl: lvl + 1
                        })
                    }
                } else if (next === 'e') {
                    [level[y][x], level[y1][x1]] = [after, 'pe'];
                }

                changed = !changed;
            }
        }
    }
    levelsState[lvl] = level;

    return this.setState({
        lvl,
        levelsState
    })
}
```
В целом, это все.