import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ value }) => {
  return (
    <div>
      <QRCode value={value} size={256} />
      <p>Escaneie o código para acessar o link!</p>
    </div>
  );
};

export default QRCodeGenerator;
