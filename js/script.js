"use strict";

(function () {
  const todoList = {
    formId: null,
    form: null,

    //находим форму и ставим this текущему объекту
    findForm() {
      const form = document.getElementById(this.formId);

      if (form === null || form.nodeName !== "FORM") {
        throw new Error("There is no such form on the page");
      }

      this.form = form;
      return form;
    },

    // берём текущую форму и отлавливаем событие
    addFormHandler() {
      this.form.addEventListener("submit", (event) => this.formHandler(event));
    },

    //
    preFillTodoList() {
      document.addEventListener(
        "DOMContentLoaded",
        this.preFillHandler.bind(this)
      );
    },

    // нужные данные из localStorage
    preFillHandler() {
      const data = this.getData();

      if (data) {
        function* generator(arr) {
          for (let i = 0; i < arr.length; i++) {
            yield arr[i];
          }
        }

        let gen = generator(data);

        for (const dB of gen) {
          const template = this.createTemplate(dB);
          document.getElementById("todoItems").prepend(template);
        }
      }

      // это массив, внутри цикла генерируем template,
      // чтобы template генерировался на каждый элемент массива
      // data.forEach((todoItem) => {
      //   const template = this.createTemplate(todoItem);
      //   document.getElementById("todoItems").prepend(template);
      // });
    },

    // описываем событие
    formHandler(event) {
      event.preventDefault();
      const inputs = this.findInputs(event.target);
      const data = {};

      //стрелочная функ чтобы установить правильный this
      inputs.forEach((input) => {
        // получаем и наполняем объект
        data[input.name] = input.value;
      });

      this.setData(data);
      const template = this.createTemplate(data);

      // находим и вставляем наши данные вперед чтобы
      // каждый раз новые toDO впереди были
      document.getElementById("todoItems").prepend(template);

      event.target.reset();
    },

    // записываем в localStorage
    setData(data) {
      //нужно сделать так чтобы в local был пустой массив
      // чтобы мы могли в него push иначе будет записываться
      // только последний в объект
      if (!localStorage.getItem(this.formId)) {
        let arr = [];
        arr.push(data);

        localStorage.setItem(this.formId, JSON.stringify(arr));

        return;
      }

      let existingData = localStorage.getItem(this.formId);
      existingData = JSON.parse(existingData);
      existingData.push(data);
      localStorage.setItem(this.formId, JSON.stringify(existingData));
    },

    // берёт данные из localS
    getData() {
      return JSON.parse(localStorage.getItem(this.formId));
    },

    // находить все нужные input
    findInputs(target) {
      return target.querySelectorAll("input:not([type=submit]), textarea");
    },

    // выводим пользователю, берем у input-ов
    // name  с значением title, description
    createTemplate({ title, description }) {
      const todoItem = this.createElement("div", "col-4");
      const taskWrapper = this.createElement("div", "taskWrapper");
      todoItem.append(taskWrapper);

      const taskHeading = this.createElement("div", "taskHeading", title);
      const taskDescription = this.createElement(
        "div",
        "taskDescription",
        description
      );

      taskWrapper.append(taskHeading);
      taskWrapper.append(taskDescription);

      return todoItem;
    },

    // создаёт div и классы и вставляет текст через innerHTML
    // автоматически а выше вызываем и передаём
    createElement(nodeName, classes, innerContent) {
      const el = document.createElement(nodeName);

      // если нужно то передаём массив классов
      // если нет то один класс
      if (Array.isArray(classes)) {
        classes.forEach((singleClassName) => {
          el.classList.add(singleClassName);
        });
      } else {
        el.classList.add(classes);
      }

      if (innerContent) {
        el.innerHTML = innerContent; // fix this
      }

      return el;
    },

    // вызывает все методы по очереди так же проверяет форму
    init(todoListFormID) {
      if (typeof todoListFormID !== "string" || todoListFormID.length === 0) {
        throw new Error("Todo list ID is not valid");
      }

      this.formId = todoListFormID;
      this.findForm();
      this.addFormHandler();
      this.preFillTodoList();
    },
  };

  // передали Id
  todoList.init("todoForm");
})();
