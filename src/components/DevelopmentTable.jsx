import './DevelopmentTable.css';

export default function DevelopmentTable({ tabla, clasesPositivas, claseNegativa }) {
  if (!tabla?.columnas || !tabla?.filas) return null;

  return (
    <div className="dev-table-wrapper">
      <div className="dev-table-scroll">
        <table className="dev-table">
          <thead>
            <tr>
              {tabla.columnas.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabla.filas.map((fila, ri) => (
              <tr key={ri}>
                {fila.map((celda, ci) => {
                  const isNum = ci === 0;
                  const isClaseReal = ci === tabla.columnas.length - 1;
                  return (
                    <td
                      key={ci}
                      className={[
                        isNum ? 'dev-table-num' : '',
                        isClaseReal ? 'dev-table-real' : '',
                      ].filter(Boolean).join(' ')}
                    >
                      {celda}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(clasesPositivas?.length > 0 || claseNegativa) && (
        <div className="dev-table-roc-note">
          <span>ROC:</span>
          {clasesPositivas?.length > 0 && (
            <span>
              Positiva = <strong>{clasesPositivas.join(' + ')}</strong>
            </span>
          )}
          {claseNegativa && (
            <span>
              Negativa = <strong>{claseNegativa}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
