// alert("hello would!!");


// const addNum = num1 => num1 + 5;
// console.log(addNum(5))

// function Person(fisrtname, lastname, dob) {
//     this.fisrtname = fisrtname;
//     this.lastname = lastname;
//     this.dob = new Date(dob);
//     this.getFullName = function () {
//         return `${this.fisrtname} ${this.lastname}`
//     }
// }

// class Person {
//     constructor(fisrtname, lastname, dob) {
//         this.fisrtname = fisrtname;
//         this.lastname = lastname;
//         this.dob = dob;
//     }
//     getFullName() {
//         return `${this.fisrtname} ${this.lastname}`
//     }
// }

// const Person1 = new Person('Dang', 'Thang', '19/03/2000');
// const Person2 = new Person("Nguyen", "Lan", '2-3-2001');
// // console.log(Person2.dob.getFullYear());
// console.log(Person1.getFullName());
// console.log(Person1);



//single element
// console.log(document.getElementById('my-form'));
// console.log(document.querySelector('h1'));

//multiple element
// console.log(document.querySelectorAll('.item'));
// console.log(document.getElementsByClassName('item'));
// console.log(document.getElementsByTagName('li'));


// const ul = document.querySelector('.items');

// // ul.remove();
// ul.firstElementChild.textContent = 'Hello';
// ul.children[1].innerText = 'Thang'
// ul.lastElementChild.innerHTML = '<h1>Hello</h1>'

const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const msg = document.querySelector('.msg');
const userList = document.querySelector('#users');

myForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();
    if (nameInput.value === '' || emailInput.value === '') {
        msg.classList.add('error');
        msg.innerHTML = 'hay dien du thong tin';

    } else {
        msg.remove();
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(`${nameInput.value}: ${emailInput.value}`));

        userList.appendChild(li);

        nameInput.value = '';
        emailInput.value = '';
    }
}