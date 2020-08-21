import Vue from "vue";
import Router from "vue-router";

import { fb, db } from "@/config/firebase";

import Home from "./views/Home.vue";

//***************** USER ***************** */
import UserDashboard from "@/components/User/Dashboard";

import UserProducts from "@/components/User/Products/Products";
import UserProduct from "@/components/User/Products/Product";

import AllCategories from "@/components/User/Products/AllCategories";

import ChickenProducts  from "@/components/User/Products/ChickenProducts";
import SauceProducts from "@/components/User/Products/Sauce";

import UserOrders from "@/components/User/Orders/Orders";
import UserOrder from "@/components/User/Orders/MyOrder";
// ************* ADMIN *************
import Dashboard from "./views/Dashboard";

import Login from "./views/Login";
import Logout from './views/Logout';

import PageNotFound from "./views/PageNotFound";

//DashboardHome
import DashboardHome from "@/components/Dashboard/Home";

//orders
import NewOrders from "@/components/Orders/New";
import CancelledOrders from "@/components/Orders/Cancelled";
import FinishedOrders from "@/components/Orders/Finished";
import AddOrders from "@/components/Orders/Add";
import OrderDetails from "@/components/Orders/OrderDetails";

//products
import Products from "@/components/Products/Products";
import AddProduct from "@/components/Products/AddProduct";
import EditProduct from "@/components/Products/EditProduct";
import ViewProduct from "@/components/Products/ViewProduct";


//categories
import Categories from "@/components/Categories/Categories";
import AddCategory from "@/components/Categories/AddCategory";
import EditCategory from "@/components/Categories/EditCategory";

//Sauces , suaces, add, edit, suace categ, add edit
import Sauces from "@/components/Sauce/Sauces";
import AddSauce from "@/components/Sauce/AddSauce"
import EditSauce from "@/components/Sauce/EditSauce"
import ViewSauce from "@/components/Sauce/ViewSauce"

import SauceCategory from "@/components/Sauce/SauceCategory";
import AddSauceCategory from "@/components/Sauce/AddSauceCategory"
import EditSauceCategory from "@/components/Sauce/EditSauceCategory"

//Chickens , add , edit delete,
import Chicken from "@/components/Chicken/Chicken";
import ChickenAdd from "@/components/Chicken/ChickenAdd"
import ChickenEdit from "@/components/Chicken/ChickenEdit"



//tables
import Tables from "@/components/Tables/Tables";
import TableMessages from "@/components/Tables/TableMessages";
import Users from "@/components/Tables/Users";
import TableAllOrders from "@/components/Tables/TableAllOrders";

import AddUser from "@/components/Tables/AddUser";
import EditUser from "@/components/Tables/EditUser";
//billout
import Billout from "@/components/Billout/Billout";

//comment
import Comments from "@/components/Comments/Comments";

//food-gallery
import Gallery from "@/components/Gallery/Gallery";

//slideshow
import Slideshow from "@/components/Slideshow/Slideshow";
import AddSlideshow from "@/components/Slideshow/AddSlideshow";
import EditSlideshow from "@/components/Slideshow/EditSlideshow";
import ViewSlideshow from "@/components/Slideshow/ViewSlideshow";

//settings
import Settings from "@/components/Settings/Settings";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/",
      component: Home,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "",
          name: "user",
          component: UserDashboard
        },
        {
          path: "/products/:category",
          name: "userproducts",
          component: UserProducts
        },
        {
          path: "/mainproduct/chicken",
          name: "userchickens",
          component: ChickenProducts
        },
         {
          path: "/mainproduct/sauces",
          name: "usersauces",
          component: SauceProducts,
          meta: {
            requireSauce: true
          },
        },
        {
          path: "/allcategories",
          name: "allcategories",
          component: AllCategories
        },
        {
          path: "/product/:id",
          name: "userproduct",
          component: UserProduct,
          
        },
        {
          path: "/myorders",
          name: "userorders",
          component: UserOrders
        },
        {
          path: "/myorder/:order_number",
          name: "userorder",
          component: UserOrder
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        requiresNotLogin: true
      }
    },
    {
      path: "/logout",
      name: "logout",
      component: Logout,
    },
    {
      path: "*",
      name: "na",
      component: PageNotFound
    },
    {
      path: "/dashboard",
      component: Dashboard,
      meta: {
        requiresAdmin: true
      },
      children: [
        {
          path: "",
          name: "dashboard",
          component: DashboardHome
        },

        {
          path: "/dashboard/new-orders",
          name: "new-orders",
          component: NewOrders
        },
        {
          path: "/dashboard/order/:order_number",
          name: "order_details",
          component: OrderDetails
        },
        {
          path: "/dashboard/add-order",
          name: "add-orders",
          component: AddOrders
        },
        {
          path: "/dashboard/cancelled-orders",
          name: "cancelled-orders",
          component: CancelledOrders
        },
        {
          path: "/dashboard/finished-orders",
          name: "finished-orders",
          component: FinishedOrders
        },
        {
          path: "/dashboard/products",
          name: "products",
          component: Products
        },
        {
          path: "/dashboard/sauces",
          name: "sauces",
          component: Sauces
        },
        {
          path: "/dashboard/sauces/add",
          name: "addsauce",
          component: AddSauce
        },
        {
          path: "/dashboard/sauces/edit/:id",
          name: "editsauce",
          component: EditSauce
        },
        {
          path: "/dashboard/sauces/view/:id",
          name: "viewsauce",
          component: ViewSauce
        },
        {
          path: "/dashboard/sauces/categories",
          name: "saucescategories",
          component: SauceCategory
        },
        {
          path: "/dashboard/sauces/category/add",
          name: "addsaucecategoryy",
          component: AddSauceCategory
        },
        {
          path: "/dashboard/sauces/category/edit/:id",
          name: "editsaucecategory",
          component: EditSauceCategory
        },
        {
          path: "/dashboard/chickens",
          name: "chickens",
          component: Chicken
        },
        {
          path: "/dashboard/chickens/add",
          name: "chickensadd",
          component: ChickenAdd
        },
        {
          path: "/dashboard/chickens/edit/:id",
          name: "chickensedit",
          component: ChickenEdit
        },
        {
          path: "/dashboard/addproduct",
          name: "addproduct",
          component: AddProduct
        },
        {
          path: "/dashboard/editproduct/:product_id",
          name: "editproduct",
          component: EditProduct
        },
        {
          path: "/dashboard/viewproduct/:product_id",
          name: "viewproduct",
          component: ViewProduct
        },
        {
          path: "/dashboard/categories",
          name: "categories",
          component: Categories
        },
        {
          path: "/dashboard/addcategory",
          name: "addcategory",
          component: AddCategory
        },
        {
          path: "/dashboard/editcategory/:category_id",
          name: "editcategory",
          component: EditCategory
        },
        {
          path: "/dashboard/tables",
          name: "tables",
          component: Tables
        },
        {
          path: "/dashboard/tables/:table_num/orders",
          name: "tableallorders",
          component: TableAllOrders
        },
        {
          path: "/dashboard/table/messages/:table_num",
          name: "tablemessages",
          component: TableMessages
        },
        {
          path: "/dashboard/billout",
          name: "billout",
          component: Billout
        },
        {
          path: "/dashboard/comments",
          name: "comments",
          component: Comments
        },
        {
          path: "/dashboard/users",
          name: "users",
          component: Users
        },
        {
          path: "/dashboard/adduser",
          name: "adduser",
          component: AddUser
        },
        {
          path: "/dashboard/edituser/:userid",
          name: "edituser",
          component: EditUser
        },
        {
          path: "/gallery",
          name: "gallery",
          component: Gallery
        },
        {
          path: "/dashboard/slideshow",
          name: "slideshow",
          component: Slideshow
        },
        {
          path: "/dashboard/add-slideshow",
          name: "addslideshow",
          component: AddSlideshow
        },
        {
          path: "/dashboard/editslide/:slide_id",
          name: "editslideshow",
          component: EditSlideshow
        },
        {
          path: "/dashboard/viewslide/:slide_id",
          name: "viewslideshow",
          component: ViewSlideshow
        },
        {
          path: "/dashboard/settings",
          name: "settings",
          component: Settings
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    fb.auth().onAuthStateChanged(user => {
      if (user) {
        let userid = fb.auth().currentUser.uid;
        db.collection("users")
          .doc(userid)
          .get()
          .then(doc => {
            if (doc.data().role === "admin") {
              next({ name: "dashboard" });
            } else {
              next();
            }
          });
      } else {
        next({ name: "login" });
      }
    });
  } else {
    next();
  }

  if (to.matched.some(rec => rec.meta.requiresAdmin)) {
    fb.auth().onAuthStateChanged(user => {
      if (user) {
        let userid = fb.auth().currentUser.uid;
        db.collection("users")
          .doc(userid)
          .get()
          .then(doc => {
            if (doc.data().role !== "admin") {
              next({ name: "user" });
            } else {
              next();
            }
          });
      } else {
        next({ name: "login" });
      }
    });
  } else {
    next();
  }

  if (to.matched.some(rec => rec.meta.requiresNotLogin)) {
    fb.auth().onAuthStateChanged(user => {
      if (user) {
        let userid = fb.auth().currentUser.uid;
        db.collection("users")
          .doc(userid)
          .get()
          .then(doc => {
            if (doc.data().role === "admin") {
              next({ name: "dashboard" });
            } else {
              next({ name: "user" });
            }
          });
      } else {
        next();
      }
    });
  } else {
    next();
  }

  if (to.matched.some(rec => rec.meta.requireSauce)) {
    fb.auth().onAuthStateChanged(user => {
      if (user) {
        let userid = fb.auth().currentUser.uid;
        db.collection("users")
          .doc(userid)
          .get()
          .then(doc => {
            if (doc.data().sauce === true) {
              next();
            } else {
              next({ name: "user" });
            }
          });
      } else {
        next();
      }
    });
  } else {
    next();
  }

});

export default router;
