import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className="hero bg-base-200 h-[94vh]">
        <div className="hero-content text-center">
          <div className="max-w-lg flex flex-col gap-5">
            <h1 className="text-4xl font-bold">Account Balances</h1>
            <p className="py-2">
              Welcome to the Bank of YAK! <br />
              Thank you for your patronage. Now pay me back.
            </p>
            <div className="overflow-x-auto bg-base-100 shadow-md rounded-box p-5">
              <table className="table table-lg table-zebra">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  <tr>
                    <th>1</th>
                    <Link className="hover:underline" to="/pay-balances">
                      <td>Nathan Co</td>
                    </Link>
                    <td>$256,142.00</td>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <th>2</th>
                    <td>Elijah Smith</td>
                    <td>$256,142.00</td>
                  </tr>
                  {/* row 3 */}
                  <tr>
                    <th>3</th>
                    <td>Brandon Pham</td>
                    <td>$256,142.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Link to="/add-bill"><button className="btn btn-primary w-full">Add Bill</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
