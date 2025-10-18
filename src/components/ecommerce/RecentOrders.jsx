import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from '../../redux/actions/orderAction';
import { useTranslation } from "react-i18next";


// Define the TypeScript interface for the table rows


// Define the table data using the interface
const tableData = [
  {
    id: 1,
    name: "MacBook Pro 13”",
    variants: "2 Variants",
    category: "Laptop",
    price: "$2399.00",
    status: "Delivered",
    image: "/images/product/product-01.jpg", // Replace with actual image URL
  },
  {
    id: 2,
    name: "Apple Watch Ultra",
    variants: "1 Variant",
    category: "Watch",
    price: "$879.00",
    status: "Pending",
    image: "/images/product/product-02.jpg", // Replace with actual image URL
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    variants: "2 Variants",
    category: "SmartPhone",
    price: "$1869.00",
    status: "Delivered",
    image: "/images/product/product-03.jpg", // Replace with actual image URL
  },
  {
    id: 4,
    name: "iPad Pro 3rd Gen",
    variants: "2 Variants",
    category: "Electronics",
    price: "$1699.00",
    status: "Canceled",
    image: "/images/product/product-04.jpg", // Replace with actual image URL
  },
  {
    id: 5,
    name: "AirPods Pro 2nd Gen",
    variants: "1 Variant",
    category: "Accessories",
    price: "$240.00",
    status: "Delivered",
    image: "/images/product/product-05.jpg", // Replace with actual image URL
  },
];

export default function RecentOrders() {

  const dispatch=useDispatch()
  const { orderList, total_items,per_page,current_page,total_pages } = useSelector((state) => state.orderListReducer);
  const { user_info } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [from,setForm]=useState(0)
  const [to,setTo]=useState(0)
  const {t}=useTranslation()
  const [filterStatus, setFilterStatus] = useState("");

  

  useEffect(() => {
    dispatch(getOrders(page, rowsPerPage,filterStatus));
  }, [dispatch, page, rowsPerPage,filterStatus]);



  useEffect(() => {
    if (current_page && per_page && total_items) {
      const fromValue = (current_page - 1) * per_page + 1;
      const toValue = Math.min(current_page * per_page, total_items);
  
      setForm(fromValue);
      setTo(toValue);
    }
  }, [current_page, per_page, total_items]);

  const goToPreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page < total_pages) setPage(page + 1);
  };
  

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between bg-gray-200 rounded-md">
        <div className="p-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t('RECENT_ORDERS')}
          </h3>
        </div>
        
      </div>

      <div className="flex flex-col md:flex-row mb-2 gap-4">
        <div className="md:flex-1 w-full">
          <form className="hidden">
            <div className="relative">
              <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                <svg
                  className="fill-gray-500 dark:fill-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search or type command..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
              />
            </div>
          </form>
        </div>
        <div className="md:flex-1 w-full">
          <form className="hidden">
            <div className="relative">
              <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                <svg
                  className="fill-gray-500 dark:fill-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search or type command..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
              />
            </div>
          </form>
        </div>

        <div className="md:flex-1 w-full">
                <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)} className="w-full rounded-md">
                  <option value="">{t("ALL")}</option>
                  <option value="0">{t("PENDING")}</option>
                  <option value="1">{t("CONFIRMED")}</option>
                  <option value="2">{t("REJECTED")}</option>
                </select>
            </div>
  
      </div>



      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y ">
            <TableRow className="">
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                {t('NAME')}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                {t('SALE')}
              </TableCell>
              <TableCell
                isHeader
                className="hidden sm:inline py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                {t("BUY")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                {t('VALIDITY')}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                {t("STATUS")}
              </TableCell>
              
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orderList.map((order) => (
              <TableRow key={order.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src={order.bundle.service.company.company_logo}
                        className="h-[50px] w-[50px]"
                        alt=""
                        style={{objectFit:'contain'}}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-[10px] sm:text-sm dark:text-white/90">
                      {order.bundle.bundle_title}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {order.rechargeble_account}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-[10px] sm:text-sm dark:text-gray-400">
                {order.bundle.selling_price} {user_info?.currency?.code}
                </TableCell>
                <TableCell className="hidden sm:inline py-3 text-gray-500 text-[10px] sm:text-sm dark:text-gray-400">
                {order.bundle.buying_price} {user_info?.currency?.code}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-[10px] sm:text-sm dark:text-gray-400">
                {order?.bundle?.validity_type?.toUpperCase()}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-[10px] sm:text-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      order.status === 1
                        ? "success"
                        : order.status === 0
                        ? "warning"
                        : "error"
                    }
                  >
                    {order.status === 0
                    ? "PENDING"
                    : order.status === 1
                    ? "CONFIRMED"
                    : "REJECTED"}
                  </Badge>
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* pagination */}
        <div className="flex flex-wrap items-center justify-end px-4 py-3 bg-white border-t-2 rounded-lg shadow-md space-x-4">
          {/* Rows per page selection */}
          <div className="flex items-center space-x-2 text-gray-600">
            <span>Rows per page:</span>
            <select className="p-1 min-w-[60px] text-gray-700">
              <option>5</option>
              <option>10</option>
              <option>20</option>
            </select>
          </div>

          {/* Pagination info */}
          <div className="text-gray-700 mx-4">{from}-{to} of {total_items}</div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-2">
          <button 
          className={`p-2 ${page === 1 ? "text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
          onClick={goToPreviousPage}
          disabled={page === 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          className={`p-2 ${page === total_pages ? "text-gray-300" : "text-gray-700 hover:text-gray-900"}`}
          onClick={goToNextPage}
          disabled={page === total_pages}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
          </div>
        </div>


      </div>
    </div>
  );
}
