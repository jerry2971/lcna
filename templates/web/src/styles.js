const style = (theme) => {
  return {
    button: {
      color: '#4F5051',
      fontFamily: ['Open Sans', 'sans-serif'].join(','),
      backgroundColor: '#eff2f2',
      '&:hover': {
        backgroundColor: '#e2e7e8'
      },
      border: '1px solid',
      borderColor: '#cad5d8'
    },
    field: {
      '&:hover': {
        backgroundColor: '#e2e7e8'
      }
    },
    inputLabelField: {
      color: '#219CA5',
      '&$fieldFocused': { color: '#219CA5' }
    },
    inputField: {
      color: '#4F5051',
      '&$fieldFocused': { color: '#4F5051' }
    },
    fieldFocused: {}
  };
};

export default style;
