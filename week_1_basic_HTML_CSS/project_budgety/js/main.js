//logic service
var logicService = (function () {
    /**
     * tạo đối tượng contructor expense
     * author: dangthang(10/3/2023)
     */
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    /**
     * Tạo đối tượng contructor income
     * author: dangthang(10/3/2023)
     */
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    /**
     * Khởi tạo đối tượng data
     * author: dangthang(10/3/2023)
     */
    var data = {
        allItems: {//đối tượng chứa 2 mảng trống
            exp: [],
            inc: []
        },
        totals: {//đối tượng chứa 2 thuộc tính = 0
            exp: 0,
            inc: 0
        },
        budget: 0,//khởi tạo = 0
        percentage: -1//khởi tạo = -1
    }

    /**
     * Hàm tính toán phần trăm thiệt hại trên tổng số tiền với từng object
     * author: dangthang(10/3/2023)
     * @param {*} totalIncome
     */
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(100 * (this.value / totalIncome));
        } else {
            this.percentage = -1;
        }
    }

    /**
     * Hàm tính toán total in và ex và gán lại giá trị cho totals
     * author: dangthang(10/3/2023)
     */
    var calculateInEx = (type) => {
        var sum = 0;
        data.allItems[type].forEach((item) => {
            sum += item.value;
        });
        data.totals[type] = sum;
    }

    return {
        /**
         * hàm tạo mới Item
         * @param {*} type
         * @param {*} des
         * @param {*} val
         * @returns newItem
         * author: dangthang(10/3/2023)
         */
        addMoney: (type, des, val) => {
            var newItem, allItems, ID;

            // Tạo Id mới
            allItems = data.allItems[type];
            if (allItems.length > 0) {
                ID = allItems[allItems.length - 1].id + 1;
            } else {
                ID = 0;
            }
            //nếu kiểu đầu vào là exp hoặc inc tạo item tương ứng với kiểu đó sau đó push vào allItems
            if (type === 'exp') {
                newItem = new Expense(ID, des, val)
            } else if (type == 'inc') {
                newItem = new Income(ID, des, val);
            }

            allItems.push(newItem);
            return newItem;
        },

        /**
         * hàm tính toán ngân sách balance update nếu có thay đổi số dư
         * author: dangthang(10/3/2023)
         */
        calculateBudget: () => {
            // tính toán tổng thu nhập và chi phí (sau đó cập nhật)
            calculateInEx('inc');
            calculateInEx('exp');

            // tính toán ngân sách: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Tính toán phần trăm trên income đã tiêu
            if (data.totals.inc > 0) {
                data.percentage = Math.round(100 * (data.totals.exp / data.totals.inc));
            } else {
                data.percentage = -1;
            }
        },

        /**
         * Hàm tính toàn phần trăm tiêu dùng
         * duyệt mảng update lại sau khi có thay đổi income
         * author: dangthang(10/3/2023)
         */

        calculatePercentages: () => {
            data.allItems.exp.forEach((cur) => {
                cur.calcPercentage(data.totals.inc);
            })
        },

        /**
         * Hàm map lại giá trị % thành mảng mới và return xử dụng để update
         * author: dangthang(10/3/2023)
         */

        getPercentages: () => {
            var allPerc = data.allItems.exp.map((exp) => {
                return exp.percentage;
            });
            return allPerc;
        },

        /**
         * Hàm lấy lại các giá trị sau khi có thay đổi trả về các đối tượng
         * author: dangthang(10/3/2023)
         */
        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
    }
}
)();

var UIService = (function () {
    /**
     * Khởi tạo các giá trị đối tượng DOM
     * author: dangthang(10/3/2023)
     */
    var UISelectors = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        container: {
            budget: '.container',
            inc: '.income__list',
            exp: '.expenses__list',
        },
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        expensesPercLabel: '.item__percentage',
    }

    /**
     * Hàm convert lại giá trị hiển thị
     * author: dangthang(10/3/2023)
     */
    var convertNumber = (num, type) => {
        var numSplit, intDigits, sign;
        num = Math.abs(num);//trị tuyệt đối
        num = num.toFixed(2);//làm tròn đến số thập phân thứ 2

        numSplit = num.split('.');//cắt chuỗi thành mảng với 2 phần nguyên và phần thập phân
        int = numSplit[0];//gán phần nguyên với int

        intDigits = int.split("");//chia phần nguyên thành mảng các phần tử
        int = '';

        intDigits.forEach((digit, index) => {
            if ((index && (intDigits.length - index) % 3 === 0)) {
                int = int + ',' + digit;
            } else {
                int += digit;
            }
        });//tách thập phân, duyệt mảng

        sign = type === 'inc' ? "+" : "-";

        return `${sign} ${int}`; //trả về số đã convert
    }

    return {
        /**
         * get các giá trị trong input
         * @return type, description, value
         * author: dangthang(10/3/2023)
         */
        getInput: () => {
            return {
                type: document.querySelector(UISelectors.inputType).value, // either inc or exp
                description: document.querySelector(UISelectors.inputDescription).value,
                value: parseFloat(document.querySelector(UISelectors.inputValue).value)
            }
        },

        /**
         * Tạo list object
         * author: dangthang(10/3/2023)
         */

        addListItem: (obj, type) => {
            var html, percentage, element;
            percentage = obj.percentage;
            // Tạo chuỗi html và thay đổi với data
            html = `<div class="item clearfix" id="${type}-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${convertNumber(obj.value, type)}</div>
                        ${!percentage ? '' : `<div class="item__percentage">${percentage}%</div>`}
                    </div>
                </div>`;

            // chèn vào DOM
            element = UISelectors.container[type];
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        /**
         * clear các input sau khi thực hiện add
         * author: dangthang(10/3/2023)
         */
        clearFields: () => {
            var fieldsDOM = document.querySelectorAll(UISelectors.inputDescription + ', ' + UISelectors.inputValue);

            fieldsDOM.forEach((field) => {
                field.value = '';
            });

            fieldsDOM[0].focus();
        },

        /**
         * Hàm hiển thị thông tin ngân sách
         * author: dangthang(10/3/2023)
         */
        showBudget: (obj) => {
            var type;
            type = obj.budget > 0 ? 'inc' : 'exp';

            document.querySelector(UISelectors.budgetLabel).textContent = convertNumber(obj.budget, type);
            document.querySelector(UISelectors.incomeLabel).textContent = convertNumber(obj.totalInc, 'inc');
            document.querySelector(UISelectors.expensesLabel).textContent = convertNumber(obj.totalExp, 'exp');

            var displayPercentage = obj.percentage > 0 ? obj.percentage + '%' : '--'
            document.querySelector(UISelectors.percentageLabel).textContent = displayPercentage;
        },

        /**
         * Hàm hiển thị phần trăm tiêu dùng
         * author: dangthang(10/3/2023)
         */
        showPercentages: (percentages) => {
            var fields = document.querySelectorAll(UISelectors.expensesPercLabel);

            fields.forEach((field, index) => {
                if (percentages[index] > 0) {
                    field.textContent = percentages[index] + '%'
                } else {
                    field.textContent = '--';
                }
            });
        },
    }
}
)();

//App main
var App = (function (budgetMain, UIMain) {
    /**
     * hàm gọi event keypress enter
     * author: dangthang(10/03/2023)
     */
    var setUpEventListeners = () => {

        document.addEventListener('keypress', (event) => {
            if (event.keycode === 13 || event.which === 13) {
                //gọi đến hàm additem
                ctrlAddItem();
            }
        });
    }
    /**
     * hàm update balance budget , income, expense, percentage
     * author: dangthang(10/3/2023)
     */
    var updateBudget = () => {
        // 1. tính toán lại ngân sách và phần trăm
        budgetMain.calculateBudget();

        // 2. trả về thông tin đối tượng budget
        var budget = budgetMain.getBudget();

        // 3. hiển thị budget
        UIMain.showBudget(budget);
    };
    /**
     * Hàm update phần trăm tiêu dùng trên từng object
     * author: dangthang(10/03/2023)
     */
    var updatePercentages = () => {
        // 1. Tính toán lại phần trăm sau khi có thay đổi
        budgetMain.calculatePercentages();

        // 2. lấy mảng phần trăm vừa được tính lại
        var percentages = budgetMain.getPercentages();

        // 3. update lại lên UI
        UIMain.showPercentages(percentages);
    };

    /**
     * Hàm additem được gọi
     */
    var ctrlAddItem = () => {
        // 1. Lấy dữ liệu đầu vào đã điền
        var input = UIMain.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. gọi hàm additem truyền các tham số nhận lại object 
            var newItem = budgetMain.addMoney(input.type, input.description, input.value);

            // 3. Thêm vào giao diện người dùng rồi xóa các trường Nhập liệu
            UIMain.addListItem(newItem, input.type);
            UIMain.clearFields();

            // 4. Tính toán và cập nhật ngân sách tổng 
            updateBudget();

            // 5. tính toán và cập nhật phần trăm tiêu dùng
            updatePercentages();
        }
    };
    /**
     * Khởi tạo giá trị đầu trên display vào với init
     * gọi đến các event được khởi tạo
     * author: dangthang(10/3/2023)
     */
    return {
        init: () => {
            UIMain.showBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListeners();
        }
    }
})(logicService, UIService);
//App bắt đầu chạy và được gọi
App.init();