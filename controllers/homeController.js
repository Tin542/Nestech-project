"use strict";
function HomeController() {
  // chua global var
  const SELF = {};
  return {
    home: (req, res) => {
      const data = [
        {
          title: 'product 1',
          price: 20000,
          image: 'https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/13-278x320.jpg'
        },
        {
          title: 'product 2',
          price: 100,
          image: 'https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/12-278x320.jpg'
        },
        {
          title: 'product 3',
          price: 500,
          image: 'https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/11-278x320.jpg'
        },
        {
          title: 'product 4',
          price: 1000,
          image: 'https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/12-278x320.jpg'
        },
        {
          title: 'product 5',
          price: 150,
          image: 'https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/10-278x320.jpg'
        },
        {
          title: 'product 6',
          price: 300,
          image: 'https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/13-278x320.jpg'
        },
        {
          title: 'product 7',
          price: 450,
          image: 'https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/11-278x320.jpg'
        },
        {
          title: 'product 8',
          price: 900,
          image: 'https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/12-278x320.jpg'
        },
      ]
      return res.render('pages/home', {listItems: data});
    }
    
  };
}

module.exports = new HomeController();
