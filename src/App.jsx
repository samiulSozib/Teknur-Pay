import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const Videos = lazy(() => import("./pages/UiElements/Videos"));
const Images = lazy(() => import("./pages/UiElements/Images"));
const Alerts = lazy(() => import("./pages/UiElements/Alerts"));
const Badges = lazy(() => import("./pages/UiElements/Badges"));
const Avatars = lazy(() => import("./pages/UiElements/Avatars"));
const Buttons = lazy(() => import("./pages/UiElements/Buttons"));
const LineChart = lazy(() => import("./pages/Charts/LineChart"));
const BarChart = lazy(() => import("./pages/Charts/BarChart"));
const Calendar = lazy(() => import("./pages/Calendar"));
const BasicTables = lazy(() => import("./pages/Tables/BasicTables"));
const FormElements = lazy(() => import("./pages/Forms/FormElements"));
const Blank = lazy(() => import("./pages/Blank"));
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
const Home = lazy(() => import("./pages/Dashboard/Home"));
const ProductsAndPackages = lazy(() => import("./pages/ProductsAndPackage/ProductsAndPackages"));
const InternetPackage = lazy(() => import("./pages/Internet/InternetPackage"));
const SocialPackage = lazy(() => import("./pages/Social/SocialPackage"));
const SocialBundle = lazy(() => import("./pages/SocialBundle/SocialBundle"));
const CreditRecharge = lazy(() => import("./pages/CreditRecharge/CreditRecharge"));
const Transaction = lazy(() => import("./pages/Transactions/transactions"));
const Order = lazy(() => import("./pages/Order/Order"));
const SubReseller = lazy(() => import("./pages/SubReseller/SubReseller"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const AddSubReseller = lazy(() => import("./pages/SubReseller/AddSubReseller"));
const SetPassword = lazy(() => import("./pages/SubReseller/SetPassword").then((m) => ({ default: m.SetPassword })));
const ChangeBalance = lazy(() => import("./pages/SubReseller/ChangeBalance").then((m) => ({ default: m.ChangeBalance })));
import ProtectedRoute from "./components/auth/ProtectedRoute";
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions/TermsAndConditions"));
const HelpCenter = lazy(() => import("./pages/HelpCenter/HelpCeneter"));
const SellingPrice = lazy(() => import("./pages/SellingPrice/SellingPrice").then((m) => ({ default: m.SellingPrice })));
const CommissionGroup = lazy(() => import("./pages/ComissionGroup/ComissionGroup").then((m) => ({ default: m.CommissionGroup })));
const HawalaOrders = lazy(() => import("./pages/HawalaOrders/Order"));
const HelpArticles = lazy(() => import("./pages/HelpArticles/HelpArticles"));
const ResellerPayment = lazy(() => import("./pages/ResellerPayment/ResellerPayment").then((m) => ({ default: m.ResellerPayment })));
const TransactionsType = lazy(() => import("./pages/TransactionsType/TransactionsType"));
const MoneyExchangeRate = lazy(() => import("./pages/MoneyExchangeRate/MoneyExchangeRate"));
const CountryViewPage = lazy(() => import("./pages/CountryViewPage/CountryViewPage"));
const BundlePage = lazy(() => import("./pages/BundlePage/BundlePage"));
const LoanRequest = lazy(() => import("./pages/LoanRequest/LoanRequest").then((m) => ({ default: m.LoanRequest })));
const TransferCommissions = lazy(() => import("./pages/TransferCommissions/TransferCommissions").then((m) => ({ default: m.TransferCommissions })));

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" /></div>}>
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
            <Route path="/loan-requests" element={<ProtectedRoute><LoanRequest/></ProtectedRoute>}/>
            <Route path="/transfer-commissions" element={<ProtectedRoute><TransferCommissions/></ProtectedRoute>}/>







          

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
        </Suspense>
      </Router>
    </>
  );
}
