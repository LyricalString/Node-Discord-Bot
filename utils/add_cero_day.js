module.exports = function add_cero_day(numero) {
  if (numero.toString().length == 1) {
    return "0" + numero;
  } else {
    return numero;
  }
};
