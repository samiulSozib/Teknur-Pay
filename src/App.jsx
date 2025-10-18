import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProductsAndPackages from "./pages/ProductsAndPackage/ProductsAndPackages";
import InternetPackage from './pages/Internet/InternetPackage'
import SocialPackage from "./pages/Social/SocialPackage";
import SocialBundle from "./pages/SocialBundle/SocialBundle";
import CreditRecharge from "./pages/CreditRecharge/CreditRecharge";
import Transaction from "./pages/Transactions/transactions";
import Order from "./pages/Order/Order";
import SubReseller from "./pages/SubReseller/SubReseller";
import Profile from "./pages/Profile/Profile";
import AddSubReseller from "./pages/SubReseller/AddSubReseller";
import { SetPassword } from "./pages/SubReseller/SetPassword";
import { ChangeBalance } from "./pages/SubReseller/ChangeBalance";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TermsAndConditions from "./pages/TermsAndConditions/TermsAndConditions";
import HelpCenter from "./pages/HelpCenter/HelpCeneter";
import { SellingPrice } from "./pages/SellingPrice/SellingPrice";
import { CommissionGroup } from "./pages/ComissionGroup/ComissionGroup";
import HawalaOrders from "./pages/HawalaOrders/Order";
import HelpArticles from "./pages/HelpArticles/HelpArticles";
import { ResellerPayment } from "./pages/ResellerPayment/ResellerPayment";
import TransactionsType from "./pages/TransactionsType/TransactionsType";
import MoneyExchangeRate from "./pages/MoneyExchangeRate/MoneyExchangeRate";
import CountryViewPage from "./pages/CountryViewPage/CountryViewPage";
import BundlePage from "./pages/BundlePage/BundlePage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/product-and-packages" element={<ProtectedRoute><ProductsAndPackages /></ProtectedRoute>} />
            <Route path="/internet" element={<ProtectedRoute><InternetPackage /></ProtectedRoute>} />
            <Route path="/bundle" element={<ProtectedRoute><BundlePage /></ProtectedRoute>} />
            <Route path="/social" element={<ProtectedRoute><SocialPackage /></ProtectedRoute>} />
            <Route path="/social-bundle" element={<ProtectedRoute><SocialBundle /></ProtectedRoute>} />
            <Route path="/credit-recharge" element={<ProtectedRoute><CreditRecharge /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
            <Route path="/transactions-type" element={<ProtectedRoute><TransactionsType /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Order /></ProtectedRoute>} />
            <Route path="/sub-reseller" element={<ProtectedRoute><SubReseller /></ProtectedRoute>} />
            <Route path="/add-sub-reseller" element={<ProtectedRoute><AddSubReseller /></ProtectedRoute>} />
            <Route path="/sub-reseller-set-password" element={<ProtectedRoute><SetPassword /></ProtectedRoute>} />
            <Route path="/sub-reseller-change-balance" element={<ProtectedRoute><ChangeBalance /></ProtectedRoute>} />
            <Route path="/terms-and-conditions" element={<ProtectedRoute><TermsAndConditions/></ProtectedRoute>}/>
            <Route path="/help-center" element={<ProtectedRoute><HelpCenter/></ProtectedRoute>}/>

            <Route path="/reseller-payments" element={<ProtectedRoute><ResellerPayment/></ProtectedRoute>}/>
            <Route path="/selling-prices" element={<ProtectedRoute><SellingPrice/></ProtectedRoute>}/>
            <Route path="/commission-groups" element={<ProtectedRoute><CommissionGroup/></ProtectedRoute>}/>
            <Route path="/hawala-orders" element={<ProtectedRoute><HawalaOrders/></ProtectedRoute>}/>
            <Route path="/help-articles" element={<ProtectedRoute><HelpArticles/></ProtectedRoute>}/>
            <Route path="/money-exchnage-rate" element={<ProtectedRoute><MoneyExchangeRate/></ProtectedRoute>}/>
            <Route path="/nonsocial" element={<ProtectedRoute><CountryViewPage/></ProtectedRoute>}/>





          

            {/* Others Page */}
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/main-profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
