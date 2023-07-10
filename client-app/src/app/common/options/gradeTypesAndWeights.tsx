export const gradeType = [
    {text: '1', value: 100},
    {text: '1+', value: 150},
    {text: '2-', value:175},
    {text: '2', value:200},
    {text: '2+', value:250},
    {text: '3-', value:275},
    {text: '3', value:300},
    {text: '3+', value:350},
    {text: '4-', value:375},
    {text: '4', value:400},
    {text: '4+', value:450},
    {text: '5-', value:475},
    {text: '5', value:500},
    {text: '5+', value:550},
    {text: '6-', value:575},
    {text: '6', value:600}
]

export const gradeTypeRegex = new RegExp(gradeType.map(grade => `^${grade.text}$`).join('|'));

export const gradeWeight = [
    {text: '1', value:1},
    {text: '2', value:2},
    {text: '3', value:3},
    {text: '4', value:4},
    {text: '5', value:5},
    {text: '6', value:6}
]

export const gradeWeightRegex = new RegExp(gradeWeight.map(grade => `^${grade.text}$`).join('|'));