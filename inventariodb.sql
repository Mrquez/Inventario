-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-06-2023 a las 17:24:46
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
CREATE SCHEMA IF NOT EXISTS `inventariodb` DEFAULT CHARACTER SET utf8 ;
USE `inventariodb` ;
--
-- Base de datos: `inventariodb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulo`
--

CREATE TABLE `articulo` (
  `idarticulo` int(11) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `fecha_creacion` date NOT NULL,
  `fecha_modificacion` date NOT NULL,
  `cantidad` int(11) NOT NULL,
  `Descripcion` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `articulo`
--

INSERT INTO `articulo` (`idarticulo`, `nombre`, `fecha_creacion`, `fecha_modificacion`, `cantidad`, `Descripcion`) VALUES
(5, 'CPU', '2023-06-23', '2023-06-23', 1, ''),
(6, 'Monitor', '2023-06-23', '2023-06-23', 10, ''),
(7, 'Mouse', '2023-06-23', '2023-06-23', 3, ''),
(9, 'CPU', '2023-06-27', '2023-06-27', 12, 'A'),
(10, '', '2023-06-27', '0000-00-00', 0, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud`
--

CREATE TABLE `solicitud` (
  `idSolicitud` int(11) NOT NULL,
  `fecha_creacion` date NOT NULL,
  `hora_inicio` varchar(10) NOT NULL,
  `hora_fin` varchar(10) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_solicitada` date NOT NULL,
  `estado` int(11) NOT NULL,
  `num_empleado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitud`
--

INSERT INTO `solicitud` (`idSolicitud`, `fecha_creacion`, `hora_inicio`, `hora_fin`, `descripcion`, `fecha_solicitada`, `estado`, `num_empleado`) VALUES
(1, '2023-06-27', '11:24 AM', '11:28 AM', 'sfvzc', '2023-06-28', 0, 0),
(2, '2023-06-27', '11:25 AM', '11:29 AM', 'zsdgvdfg', '2023-06-29', 0, 0),
(3, '2023-06-27', '12:00 PM', '12:05 PM', 'prueba estado', '2023-06-28', 0, 0),
(4, '2023-06-27', '12:00 PM', '12:08 PM', 'Estado con numero', '2023-06-28', 2, 0),
(5, '2023-06-27', '12:00 PM', '12:12 PM', 'asdf', '2023-06-28', 2, 0),
(6, '2023-06-27', '12:22 PM', '12:26 PM', 'zdfcx', '2023-06-28', 2, 0),
(7, '2023-06-27', '12:25 PM', '12:27 PM', 'sdas', '2023-06-28', 2, 0),
(8, '2023-06-27', '12:28 PM', '12:29 PM', 'sdas', '2023-06-03', 2, 0),
(9, '2023-06-27', '12:33 PM', '12:34 PM', 'prueba num_empleado', '2023-06-28', 2, 0),
(10, '2023-06-27', '12:36 PM', '12:37 PM', 'prueba 2', '2023-06-09', 2, 0),
(11, '2023-06-27', '12:39 PM', '12:40 PM', 'prueba 3', '2023-06-28', 2, 0),
(12, '2023-06-27', '12:44 PM', '12:46 PM', 'prueba 4', '2023-06-28', 2, 0),
(13, '2023-06-27', '12:55 PM', '12:55 PM', 'prueba 6', '2023-06-28', 2, 0),
(14, '2023-06-27', '1:07 PM', '1:07 PM', 'ASa', '2023-06-29', 2, 0),
(15, '2023-06-27', '1:10 PM', '1:10 PM', 'asda', '2023-06-28', 2, 0),
(16, '2023-06-27', '1:11 PM', '1:11 PM', 'sxdf', '2023-06-05', 2, 0),
(17, '2023-06-27', '1:15 PM', '1:15 PM', 'uyuyuii', '2023-06-16', 2, 0),
(18, '2023-06-27', '1:16 PM', '1:16 PM', 'jujui', '2023-06-28', 2, 101010),
(19, '2023-06-27', '1:18 PM', '1:18 PM', 'adfjknas', '2023-06-28', 2, 101010),
(20, '2023-06-27', '1:19 PM', '1:19 PM', 'jsjsj', '2023-06-28', 2, 101010),
(21, '2023-06-27', '1:23 PM', '1:23 PM', 'sdfsd', '2023-06-09', 2, 101010),
(22, '2023-06-27', '1:26 PM', '1:26 PM', 'ASDFDS', '2023-06-21', 2, 101010),
(23, '2023-06-27', '1:37 PM', '1:37 PM', 'FSEDF', '2023-06-28', 2, 101010),
(24, '2023-06-27', '1:40 PM', '1:40 PM', 'SDFA', '2023-06-28', 2, 101010),
(25, '2023-06-27', '1:30 PM', '1:30 PM', 'SDF', '2023-06-28', 2, 101010);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `nom_usuario` varchar(60) NOT NULL,
  `num_empleado` int(11) NOT NULL,
  `contrasena` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `nom_usuario`, `num_empleado`, `contrasena`) VALUES
(1, 'Claudio', 10101010, '10101010'),
(2, 'Jesus Eloy', 120846, '120846'),
(3, 'Claudio Mqz', 101010, '101010');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `articulo`
--
ALTER TABLE `articulo`
  ADD PRIMARY KEY (`idarticulo`);

--
-- Indices de la tabla `solicitud`
--
ALTER TABLE `solicitud`
  ADD PRIMARY KEY (`idSolicitud`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `articulo`
--
ALTER TABLE `articulo`
  MODIFY `idarticulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `solicitud`
--
ALTER TABLE `solicitud`
  MODIFY `idSolicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
