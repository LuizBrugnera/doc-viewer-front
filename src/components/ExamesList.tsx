export const ExamList = () => (
  <div className="p-4">
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h2 className="text-xl font-bold text-purple-600 mb-4">
        EXAMES COMPLEMENTARES Á FAZER
      </h2>
      <table className="w-full">
        <thead>
          <tr className="bg-purple-100">
            <th className="p-2 text-left">Cod:</th>
            <th className="p-2 text-left">Exame Ocupacional:</th>
            <th className="p-2 text-left">Dia Útens:</th>
            <th className="p-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {[
            { cod: "568", exam: "Aso", days: "1" },
            { cod: "882", exam: "Hemograma", days: "3" },
            { cod: "460", exam: "Glicemia", days: "3" },
            { cod: "789", exam: "Audiometria", days: "1" },
            { cod: "856", exam: "Eletrocardiograma", days: "4" },
            { cod: "668", exam: "Eletroencefalograma", days: "4" },
            { cod: "568", exam: "Tgo", days: "6" },
            { cod: "166", exam: "Tgp", days: "6" },
            { cod: "151", exam: "Ppf", days: "3" },
            { cod: "584", exam: "Coprocultura", days: "3" },
            { cod: "651", exam: "Acido", days: "6" },
            { cod: "848", exam: "Rx de torax", days: "4" },
          ].map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="p-2">{item.cod}</td>
              <td className="p-2">{item.exam}</td>
              <td className="p-2">{item.days}</td>
              <td className="p-2">
                <button>📝</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-4 flex items-center text-purple-600 hover:text-purple-800">
        <span className="mr-2">+</span> Adicionar exame na listagem
      </button>
    </div>
  </div>
);
