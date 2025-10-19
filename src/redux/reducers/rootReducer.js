import {combineReducers} from 'redux'
import authReducer from './authReducer'
import dashboardReducer from './dashboardReducer'
import serviceCategoriesReducer from './serviceCategoriesReducer'
import orderListReducer from './orderReducer'
import transactionListReducer from './transactionReducer'
import subResellerListReducer from './subResellerReducer'
import serviceListReducer from './serviceReducer'
import bundleListReducer from './bundleReducer'
import locationReducer from './locationReducer'
import rechargeReducer from './rechargeReducer'
import sellingPriceReducer from './sellingPriceReducer'
import commissionGroupReducer from './commissionGroupReducer'
import hawalaOrdersReducer from './hawalaOrdersReducer'
import resellerPaymentReducer from './resellerPaymentReducer'
import loanRequestReducer from './loanRequestReducer'
import transferCommissionReducer from './transferCommissionReducer'


const rootReducer=combineReducers({
    auth:authReducer,
    dashboardReducer:dashboardReducer,
    serviceCategoriesReducer:serviceCategoriesReducer,
    orderListReducer:orderListReducer,
    transactionListReducer:transactionListReducer,
    subResellerListReducer:subResellerListReducer,
    serviceListReducer:serviceListReducer,
    bundleListReducer:bundleListReducer,
    locationReducer:locationReducer,
    rechargeReducer:rechargeReducer,
    sellingPriceReducer:sellingPriceReducer,
    commissionGroupReducer:commissionGroupReducer,
    hawalaOrdersReducer:hawalaOrdersReducer,
    resellerPaymentReducer:resellerPaymentReducer,
    loanRequestReducer:loanRequestReducer,
    transferCommissionReducer:transferCommissionReducer
})

export default rootReducer