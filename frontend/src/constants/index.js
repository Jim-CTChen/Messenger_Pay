const COLOR_ARRAY = ['#E38627', '#C13C37', '#6A2135',
  '#00AA55', '#009FD4', '#B381B3', '#939393', '#E3BC00',
  '#D47500', '#DC2A2A', '#cf3c88', '#d70c7e', '#b7b82d',
  "#FFB900", "#D83B01", "#B50E0E", "#E81123", "#B4009E",
  "#DB4437", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5"
];

const EVENT_TYPE = {
  PERSONAL: {
    label: '個人',
    color: 'primary'
  },
  GROUP: {
    label: '群組',
    color: 'secondary'
  },
}

const SORT_MODE = {
  TIME_NEW2OLD: 0,
  TIME_OLD2NEW: 1,
  AMOUNT_L2H: 2,
  AMOUNT_H2L: 3
}

const FILTER_MODE = {
  ALL: 0,
  CREDITOR: 1,
  DEBTOR: 2
}

export default {
  COLOR_ARRAY,
  EVENT_TYPE,
  SORT_MODE,
  FILTER_MODE
}