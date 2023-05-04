const homePage = (req, res) => {
  var fakeData = [
    {
      title: "Card title 1",
      image:
        "https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/04-278x320.jpg",
      price: 120,
    },
    {
      title: "Card title 2",
      image:
        "https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/04-278x320.jpg",
      price: 130,
    },
    {
      title: "Card title 3",
      image:
        "https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/04-278x320.jpg",
      price: 150,
    },
    {
      title: "Card title 4",
      image:
        "https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/04-278x320.jpg",
      price: 130,
    },
    {
      title: "Card title 5",
      image:
        "https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/04-278x320.jpg",
      price: 130,
    },
    {
      title: "Card title 6",
      image:
        "https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/04-278x320.jpg",
      price: 130,
    },
    {
      title: "Card title 7",
      image:
        "https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/04-278x320.jpg",
      price: 130,
    },
    {
      title: "Card title 8",
      image:
        "https://capricathemes.com/opencart/OPC02/OPC020033/image/cache/catalog/04-278x320.jpg",
      price: 130,
    },
  ];
  res.render("home", {listItems: fakeData});
};

module.exports = {
  homePage,
};
