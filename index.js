var calculate = (function() {
    var income = function(id, dis, amt) {
        this.id = id,
        this.dis = dis,
        this.amt = amt
    }
    var expense = function(id, dis, amt) {
        this.id = id,
        this.dis = dis,
        this.amt = amt
    }
    var sumbud = function(type) {
        var sum = 0;
        vals.inputs[type].forEach(function(cur) {
            sum += cur.amt;
        });
        vals.total[type] = sum;
    }
    var vals = {
        inputs: {
            inc:[],
            exp:[]
        },
        total: {
            inc:0,
            exp:0
        },
        budget:0,
        percent:-1
    }
    return {
        getinput:function(type, dis, amt) {
            var newItem, id;
            if(vals.inputs[type].length == 0) {
                id = 0;
            }          
            if(vals.inputs[type].length>0) {
                id = vals.inputs[type][vals.inputs[type].length - 1].id + 1; 
            }  

            if(type == 'inc') {
                newItem = new income(id, dis, amt);
            }
            else {
                newItem = new expense(id, dis, amt);
            }
            vals.inputs[type].push(newItem);

            return newItem;
        },
        calculateBud:function(type) {
            sumbud(type);
            vals.budget = vals.total.inc - vals.total.exp;
            if(vals.total.inc <=0 ) vals.percent = "-- ";
            else vals.percent = ((vals.total.exp/vals.total.inc) * 100).toFixed(1);
        },
        retBud:function() {
            
            return {
                totalbudget: vals.budget,
                percentage: vals.percent,
                totalinc: vals.total.inc,
                totalexp: vals.total.exp
            }
        },
        deleteItem:function(type, id) {
            var ids, index;
            ids = vals.inputs[type].map(function(cur) {
                return cur.id;
            });
            index = ids.indexOf(id);
            if(index != -1) 
                vals.inputs[type].splice(index, 1);
        }
    }
})();

var uictrl = (function() {
    return {
        getInput:function() {
            return {
                type: document.querySelector("#opt").value,
                dis: document.querySelector("#desc").value,
                amt: parseInt(document.querySelector("#amount").value),
            }
        },
        additem:function(newEle, type) {
            var html, newHTML;
            if(type =='inc') 
                html = '<div class="row addItem" id="inc-_id_"><div class="col-6 description">_description_</div><div class="col-4 amount">_amt_</div><div class="col-2 delete" role="button"><i class="fa-regular fa-circle-xmark fa-xl"></i></div></div>';
            else if(type == 'exp') 
                html = '<div class="row removeItem" id="exp-_id_"><div class="col-6 description">_description_</div><div class="col-4 amount">_amt_</div><div class="col-2 delete" role="button"><i class="fa-regular fa-circle-xmark fa-xl"></i></div></div>';
        
            newHTML = html.replace("_id_", newEle.id);
            newHTML = newHTML.replace("_description_", newEle.dis);
            newHTML = newHTML.replace("_amt_", this.rupee.format(newEle.amt));

            if(type == "inc")
                document.querySelector(".container-inc").insertAdjacentHTML("beforeend", newHTML);
            else if(type == "exp")
                document.querySelector(".container-exp").insertAdjacentHTML("beforeend", newHTML);
        },
        dispalybud:function(values) {
            if(values.totalbudget >=0 )
                document.querySelector("#remain").textContent = "+" + this.rupee.format(values.totalbudget);
            else
                document.querySelector("#remain").textContent = this.rupee.format(values.totalbudget);
            document.querySelector(".showinc").textContent = this.rupee.format(values.totalinc);
            document.querySelector(".showexp").textContent = this.rupee.format(values.totalexp);
            document.querySelector(".showper").innerHTML = values.percentage + "%";
        },
        delDiv:function(item) {
            var ele = document.getElementById(item);
            ele.parentNode.removeChild(ele);
        },
        rupee: new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        })
    }
})();

var main = (function() {
    var deleteItem = (function(event) {
        var item, id, type, splitItem;
        item = event.target.parentNode.parentNode.id;
        splitItem = item.split("-");
        id = parseInt(splitItem[1]);
        type = splitItem[0];
        calculate.deleteItem(type, id);    
        uictrl.delDiv(item); 
        calcbudget(type);  
    });
    var calcbudget = (function(type) {
        calculate.calculateBud(type);
        var bud = calculate.retBud();
        uictrl.dispalybud(bud);
    });
    var input_read = (function() {
        var input = uictrl.getInput();
        
        var sendInput = calculate.getinput(input.type, input.dis, input.amt);
        
        if(input.dis == "") window.alert("Enter Valid Description");
        else if(input.amt == "" || input.amt < 0) window.alert("Enter Valid Amount");
        else uictrl.additem(sendInput, input.type);

        calcbudget(input.type);

        var allInputs = document.querySelectorAll('input');
        allInputs.forEach(singleInput => singleInput.value = '');
    });
    var start = (function() {
        document.querySelector(".btn").addEventListener("click", input_read);
        document.addEventListener('keypress',function(event) {
            if(event.key == "Enter") {
                input_read;
            }
        });

        document.querySelector(".lists").addEventListener("click", deleteItem);
    });
    return {
        init:function() {
            const d = new Date();
            const monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            var name = d.getMonth();
            var month = monthList[name];
            var year = d.getFullYear();
            document.querySelector(".month").textContent = month + ", " + year;
            start();
        }
    }
})(uictrl, calculate);
main.init();