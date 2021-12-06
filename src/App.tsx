import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home, Search, Admin } from "./pages"
import { ToastContainer } from "react-toastify"
import "./app.scss"
import "react-toastify/dist/ReactToastify.css"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/search" element={<Search />} />
					<Route path="/admin" element={<Admin />} />
				</Routes>
			</Router>
			<ToastContainer
				position="bottom-right"
				autoClose={7000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
		</div>
	)
}

export default App
