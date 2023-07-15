const AdminController = require('../../controllers/adminController');

async function testAdmin(){
    const test = await AdminController.getRevenueInMonth('2023', '07');
    console.log(test);
}
testAdmin();