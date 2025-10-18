import {
  COUNTRY_LIST_REQUEST,
  COUNTRY_LIST_SUCCESS,
  COUNTRY_LIST_FAIL,
  DISTRICT_LIST_REQUEST,
  DISTRICT_LIST_SUCCESS,
  DISTRICT_LIST_FAIL,
  PROVINCE_LIST_REQUEST,
  PROVINCE_LIST_SUCCESS,
  PROVINCE_LIST_FAIL,
  LANGUAGE_LIST_REQUEST,
  LANGUAGE_LIST_SUCCESS,
  LANGUAGE_LIST_FAIL,
  HAWALA_CURRENCY_LIST_REQUEST,
  HAWALA_CURRENCY_LIST_SUCCESS,
  HAWALA_CURRENCY_LIST_FAIL,
  HAWALA_BRANCH_LIST_REQUEST,
  HAWALA_BRANCH_LIST_SUCCESS,
  HAWALA_BRANCH_LIST_FAIL,
  HELP_ARTICLE_LIST_REQUEST,
  HELP_ARTICLE_LIST_SUCCESS,
  HELP_ARTICLE_LIST_FAIL,
  PAYMENT_METHOD_LIST_REQUEST,
  PAYMENT_METHOD_LIST_SUCCESS,
  PAYMENT_METHOD_LIST_FAIL,
  PAYMENT_TYPE_LIST_REQUEST,
  PAYMENT_TYPE_LIST_SUCCESS,
  PAYMENT_TYPE_LIST_FAIL,
  CURRENCIES_LIST_REQUEST,
  CURRENCIES_LIST_SUCCESS,
  CURRENCIES_LIST_FAIL,
} from "../constants/locationConstant";

const initialState = {
  countries: [],
  districts: [],
  provinces: [],
  languages: [],
  hawalaCurrencies: [],
  hawalaBranches:[],
  helpArticles:[],
  payment_methods:[],
  payment_types:[],
  currencies:[],
  error: null,
  loading: false,
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case COUNTRY_LIST_REQUEST:
      return { ...state, loading: true };
    case COUNTRY_LIST_SUCCESS:
      return { ...state, loading: false, countries: action.payload.countries };
    case COUNTRY_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    case DISTRICT_LIST_REQUEST:
      return { ...state, loading: true };
    case DISTRICT_LIST_SUCCESS:
      return { ...state, loading: false, districts: action.payload.districts };
    case DISTRICT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PROVINCE_LIST_REQUEST:
      return { ...state, loading: true };
    case PROVINCE_LIST_SUCCESS:
      return { ...state, loading: false, provinces: action.payload.provinces };
    case PROVINCE_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    case LANGUAGE_LIST_REQUEST:
      return { ...state, loading: true };
    case LANGUAGE_LIST_SUCCESS:
      return { ...state, loading: false, languages: action.payload.languages };
    case LANGUAGE_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    case HAWALA_CURRENCY_LIST_REQUEST:
      return { ...state, loading: true };
    case HAWALA_CURRENCY_LIST_SUCCESS:
      return { ...state, loading: false, hawalaCurrencies: action.payload.rates };
    case HAWALA_CURRENCY_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    case HAWALA_BRANCH_LIST_REQUEST:
      return { ...state, loading: true };
    case HAWALA_BRANCH_LIST_SUCCESS:
      return { ...state, loading: false, hawalaBranches: action.payload.hawalabranches };
    case HAWALA_BRANCH_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    case HELP_ARTICLE_LIST_REQUEST:
      return { ...state, loading: true };
    case HELP_ARTICLE_LIST_SUCCESS:
      return { ...state, loading: false, helpArticles: action.payload.articles };
    case HELP_ARTICLE_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    case PAYMENT_METHOD_LIST_REQUEST:
      return { ...state, loading: true };
    case PAYMENT_METHOD_LIST_SUCCESS:
      return { ...state, loading: false, payment_methods: action.payload.payment_methods };
    case PAYMENT_METHOD_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    case PAYMENT_TYPE_LIST_REQUEST:
      return { ...state, loading: true };
    case PAYMENT_TYPE_LIST_SUCCESS:
      return { ...state, loading: false, payment_types: action.payload.payment_types };
    case PAYMENT_TYPE_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    case CURRENCIES_LIST_REQUEST:
      return { ...state, loading: true };
    case CURRENCIES_LIST_SUCCESS:
      return { ...state, loading: false, currencies: action.payload.currencies };
    case CURRENCIES_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };


    default:
      return state;
  }
};

export default locationReducer;
