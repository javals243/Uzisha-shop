// Sidebar imports
import { UilClipboardAlt } from "@iconscout/react-unicons";

// Analytics Cards imports
import { UilUsdSquare, UilMoneyWithdrawal } from "@iconscout/react-unicons";

// Recent Card Imports
import img1 from "../imgs/img1.png";
import img2 from "../imgs/img2.png";
import img3 from "../imgs/img3.png";

// Sidebar Data

// Analytics Cards Data

export const cardsData = [
  {
    title: "Sales",
    color: {
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "25,970",
    png: UilUsdSquare,
    series: [
      {
        name: "Sales",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
  {
    title: "Revenue",
    color: {
      backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
      boxShadow: "0px 10px 20px 0px #FDC0C7",
    },
    barValue: 80,
    value: "14,270",
    png: UilMoneyWithdrawal,
    series: [
      {
        name: "Revenue",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Expenses",
    color: {
      backGround:
        "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
      boxShadow: "0px 10px 20px 0px #F9D59B",
    },
    barValue: 60,
    value: "4,270",
    png: UilClipboardAlt,
    series: [
      {
        name: "Expenses",
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
];

// Recent Update Card Data
export const UpdatesData = [
  {
    img: img1,
    name: "Andrew Thomas",
    noti: "has ordered Apple smart watch 2500mh battery.",
    time: "25 seconds ago",
  },
  {
    img: img2,
    name: "James Bond",
    noti: "has received Samsung gadget for charging battery.",
    time: "30 minutes ago",
  },
  {
    img: img3,
    name: "Iron Man",
    noti: "has ordered Apple smart watch, samsung Gear 2500mh battery.",
    time: "2 hours ago",
  },
];
export const Address = [
  {
    name: "Kahembe",
    price: 0.5,
  },
  {
    name: "Murara",
    price: 0.3,
  },
  {
    name: "Bujovu",
    price: 0.5,
  },
  {
    id: 4,
    name: "Majengo",
    price: 0.6,
  },
  {
    name: "Mabanga nord",
    price: 0.7,
  },
  {
    name: "Mabanga sud",
    price: 0.8,
  },
  {
    name: "Kasika",
    price: 0.8,
  },
  {
    name: "Ka toyi",
    price: 0.9,
  },
  {
    name: "Ndosho",
    price: 1,
  },
  {
    name: "Mugunga",
    price: 1.2,
  },
  {
    name: "Virunga",
    price: 0.4,
  },
  {
    name: "Les Volcans",
    price: 0.3,
  },
  {
    name: "Mikeno",
    price: 0.7,
  },
  {
    name: "Mapendo",
    price: 0.5,
  },
  {
    name: "Katindo",
    price: 0.7,
  },
  {
    name: "Himbi",
    price: 0.6,
  },
  {
    name: "Keshero",
    price: 0.9,
  },
  {
    name: " Lac Vert",
    price: 1.4,
  },
];
