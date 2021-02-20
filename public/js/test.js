
const express = require('express')
const bodyParser = require('body-parser')
const path = require("path")
const app = express()
const port = 3000

app.use(bodyParser.urlencoded())
global.orders = []
let states = [] // keep states in Array
states.push("ordered")  //statemachine - a variable that is going through a states
states.push("cooked")
states.push("served")
states.push("paid")

app.post('/placeorder', (req, res) => {
    //to view your order - http://localhost:3000/view
    // objects- to store list of information of an the object- in this case it will do this for the 'order'
    order = {}
    order.state = "ordered"
    order.tableNumber = req.body["tableNumber"]
    delete req.body.tableNumber// BODY- this is requesting the informtion from the body of the html from the 'table number'
    order.items = req.body
    order.number = global.orders.length + 1   //Note, the order number is 1 more than the orders index in the array (becuase we don't want an order #0)
    global.orders.push(order)
    res.send('Order Accepted #' + order.number)

})

app.get('/view', (req, res) => {   // to view your order - http://localhost:3000/view
    outputOrders(req, res)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/setState', (req, res) => {
    setOrderState(req, res)
    outputOrders(req, res)
})

app.use(express.static(path.join(__dirname, 'public')));

function outputOrders(req, res) {
    let filter = req.query["filter"]
    let ordersHTML = []
    ordersHTML.push('<html><body>')
    for (const order of global.orders) {
        if (filter == null || order.state == filter) {
            ordersHTML.push(orderHTML(order))
        }
    }
    ordersHTML.push('</body></html>')
    res.send(ordersHTML.join(''))
}

function orderHTML(order) {
    let elements = []

    elements.push("<table><tr><td>Order#" + order.number + "</td>")
    elements.push("<td>Table#" + order.tableNumber + "</td></tr>")
    for (const key in order.items) {
        quantity = order.items[key]
        if (quantity > 0) {
            elements.push("<tr><td>" + quantity + " * " + key + "</td>")
        }
    }
    elements.push("<td>" + order.state + "</td></tr></table>")
    elements.push(stateButtons(order))
    console.log(orders)
    return (elements.join(" - ") + "<br>")

}
console.log(orderHTML)






function stateButtons(order) {      //This finction  for buttons the STAFF will use to identify the state on which the order is at...
    let buttons = []
    for (const state of states) {
        buttons.push('<a href=/setState?orderNumber=' + order.number + '&state=' + state + '><button>Mark as ' + state + ' </button></a>')
    }//we are using html in a href to change the status of the button and the state of the order
    return buttons.join(' ')
}

function setOrderState(req, res) {
    //transition state - based on a ?state=ordernum NameValue pair
    let order = global.orders[parseInt(req.query["orderNumber"]) - 1]
    order.state = req.query["state"]
} //this function allows us to update the status of where the oder is at . 

// Diners will seat themselves at numbered tables
// They will place orders using an HTML form
// Orders will go into a queue to be cooked and served
// Orders transition through the states: -
// "ordered"
// "cooked"
// "served"
// "paid"
// The orders will go into the queue in an 'ordered' state - to be cooked in the kitchen
// The chef will mark cooked orders as 'cooked'
// The waitress will mark cooked orders as 'served'
// The Maître de will mark served orders as 'paid'

// need to make a static form 
