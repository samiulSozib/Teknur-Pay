import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
    getLoanRequests,
    addLoanRequest,
} from "../../redux/actions/loanRequestAction";
import Swal from "sweetalert2";

export const LoanRequest = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [showDialog, setShowDialog] = useState(false);
    const [balanceAmount, setBalanceAmount] = useState("");

    // pagination states
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const {
        loanRequestList,
        loading,
        error,
        message,
        total_pages,
        current_page,
        total_items,
        per_page
    } = useSelector((state) => state.loanRequestReducer);
    const { user_info } = useSelector((state) => state.auth);


    // Calculate from and to values for pagination
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);

    // Fetch loan requests on load or pagination change
    useEffect(() => {
        dispatch(getLoanRequests(page, itemsPerPage));
    }, [dispatch, page]);

    useEffect(() => {
        if (current_page && per_page && total_items) {
            const fromValue = (current_page - 1) * per_page + 1;
            const toValue = Math.min(current_page * per_page, total_items);
            setFrom(fromValue);
            setTo(toValue);
        }
    }, [current_page, per_page, total_items]);

    const breadcrumbPaths = [
        { label: t("MENU.LOAN_REQUESTS"), href: "/loan-requests" },
    ];

    // modal handlers
    const handleOpenDialog = () => {
        setShowDialog(true);
    };
    const handleCloseDialog = () => {
        setShowDialog(false);
        setBalanceAmount("");
    };

    // submit new loan request
    const handleSubmit = async () => {
        console.log(balanceAmount)
        try {
            if (!balanceAmount || Number(balanceAmount) <= 0) {
                Swal.fire({
                    title: t("ERROR"),
                    text: t("PLEASE_ENTER_VALID_AMOUNT"),
                    icon: "error",
                });
                return;
            }

            const result = await dispatch(addLoanRequest(balanceAmount));

            if (result.success) {
                Swal.fire({
                    title: t("SUCCESS"),
                    text: t("LOAN_REQUEST_SUBMITTED_SUCCESSFULLY"),
                    icon: "success",
                });
                handleCloseDialog();
                dispatch(getLoanRequests(page, itemsPerPage));
            } else {
                Swal.fire({
                    title: t("ERROR"),
                    text: result.error || t("FAILED_TO_SUBMIT_LOAN_REQUEST"),
                    icon: "error",
                });
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: t("ERROR"),
                text: t("FAILED_TO_SUBMIT_LOAN_REQUEST"),
                icon: "error",
            });
        }
    };

    // pagination controls
    const goToPreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const goToNextPage = () => {
        if (page < total_pages) setPage(page + 1);
    };

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* Breadcrumb */}
            <div className="col-span-12 space-y-6 xl:col-span-12">
                <Breadcrumb paths={breadcrumbPaths} />
            </div>

            {/* Add Button */}
            <div className="border rounded-md bg-white col-span-12 space-y-6 xl:col-span-12 p-1">
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-end">
                        <button
                            onClick={handleOpenDialog}
                            style={{ borderRadius: "50px" }}
                            className="h-11 w-36 bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition"
                        >
                            {t("REQUEST_LOAN")}
                        </button>
                    </div>
                </div>
            </div>

            {/* Loan Requests List */}
            <div className="border rounded-md bg-[#EEF4FF] col-span-12 space-y-6 xl:col-span-12 p-2">
                {loading ? (
                    <div className="text-center text-gray-600 py-10">
                        {t("LOADING")}...
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">
                        {t("FAILED_TO_LOAD_DATA")}
                    </div>
                ) : loanRequestList.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        {t("NO_LOAN_REQUEST_FOUND")}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {loanRequestList.map((loan) => {
                            // Determine status colors with proper class mapping
                            const statusConfig = {
                                completed: {
                                    border: "border-green-200",
                                    bg: "bg-green-50",
                                    borderB: "border-b-green-200",
                                    text: "text-green-600"
                                },
                                pending: {
                                    border: "border-yellow-200",
                                    bg: "bg-yellow-50",
                                    borderB: "border-b-yellow-200",
                                    text: "text-yellow-600"
                                },
                                rollbacked: {
                                    border: "border-red-200",
                                    bg: "bg-red-50",
                                    borderB: "border-b-red-200",
                                    text: "text-red-600"
                                }
                            };

                            const config = statusConfig[loan.status] || statusConfig.rollbacked;

                            return (
                                <div
                                    key={loan.id}
                                    className={`col-span-1 mb-1 border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${config.border}`}
                                >
                                    {/* Amount with status-colored background */}
                                    <div className={`${config.bg} py-2 px-3 ${config.borderB}`}>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                                {t("AMOUNT")}
                                            </span>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {loan.amount} {loan.currency?.symbol}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Compact content */}
                                    <div className="bg-white rounded-lg p-3 flex flex-col gap-2">
                                        {/* Type */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                {t("TRANSACTION_TYPE")}
                                            </span>
                                            <p className="text-xs text-gray-600">
                                                {loan.transaction_type}
                                            </p>
                                        </div>

                                        {/* Remaining Balance */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                {t("REMAINING_BALANCE")}
                                            </span>
                                            <p className="text-xs text-gray-600">
                                                {loan.remaining_balance} {loan.currency?.symbol}
                                            </p>
                                        </div>

                                        {/* Notes */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                {t("NOTES")}
                                            </span>
                                            <p className="text-xs text-gray-600 truncate max-w-[120px]">
                                                {loan.description}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                {t("STATUS")}
                                            </span>
                                            <span className={`text-xs font-semibold ${config.text}`}>
                                                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                            </span>
                                        </div>

                                        {/* Date */}
                                        <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-1">
                                            <span className="text-xs text-gray-500">
                                                {t("DATE")}
                                            </span>
                                            <span className="text-xs text-gray-700">
                                                {new Date(loan.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination Controls - Same as Order component */}

                <div className="flex flex-wrap items-center justify-end px-4 py-3 bg-white border-t-2 rounded-lg shadow-md space-x-4 mt-6">
                    {/* Rows per page selection */}
                    <div className="flex items-center space-x-2 text-gray-600">
                        <span>{t("ROWS_PER_PAGE")}:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setRowsPerPage(+e.target.value)}
                            className="p-1 min-w-[60px] text-gray-700"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    {/* Pagination info */}
                    <div className="text-gray-700 mx-4">
                        {from}-{to} of {total_items}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center space-x-2">
                        <button
                            className={`p-2 ${page === 1
                                ? "text-gray-300"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                            onClick={goToPreviousPage}
                            disabled={page === 1}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            className={`p-2 ${page === total_pages
                                ? "text-gray-300"
                                : "text-gray-700 hover:text-gray-900"
                                }`}
                            onClick={goToNextPage}
                            disabled={page === total_pages}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>

            {/* Loan Request Dialog */}
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-[50%] xl:w-[35%] text-left">
                        <h2 className="text-xl font-semibold mb-4">{t("REQUEST_LOAN")}</h2>

                        <div className="rounded-md border border-gray-300 p-5 space-y-4">
                            <div className="flex flex-col w-full">
                                <label className="text-gray-600 text-sm mb-1 font-medium">
                                    {t("BALANCE_AMOUNT")}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={balanceAmount}
                                        onChange={(e) => setBalanceAmount(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pr-16"
                                        placeholder={t("ENTER_AMOUNT")}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                        {user_info?.currency?.code || "USD"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={handleCloseDialog}
                                className="px-4 py-2 text-gray-700 font-medium bg-white border border-gray-300 rounded-[50px] hover:bg-gray-100 transition"
                            >
                                {t("CANCEL")}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!balanceAmount}
                                className="px-4 py-2 text-white font-medium bg-green-500 rounded-[50px] hover:bg-green-600 transition disabled:bg-green-300 disabled:cursor-not-allowed"
                            >
                                {t("SUBMIT")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};