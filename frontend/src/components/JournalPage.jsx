import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ConclusionsJournalPage = () => {
  const [conclusions, setConclusions] = useState([]);
  const [filteredConclusions, setFilteredConclusions] = useState([]);
  const [filters, setFilters] = useState({
    registration_number: "",
    status: "",
    region: "",
    creation_date_from: "",
    creation_date_to: "",
    iin: "",
    case_number: "",
    approver_name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const userRegion = localStorage.getItem("userRegion"); // Регион пользователя

  useEffect(() => {
    const fetchConclusions = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3350/api/cards", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Data fetched:", response.data); // Логируем данные

        const formattedData = response.data.map((item) => ({
          ...item,
          registration_number: item.registration_number || "",
          status: item.status || "",
          region: item.region || "",
          approver_name: item.approver_name || "",
          iin: item.iin || "",
          case_number: item.case_number || "",
          creation_date: item.creation_date || "",
        }));

        if (userRole === "Сотрудник СУ") {
          const userId = localStorage.getItem("userId");
          setConclusions(formattedData.filter((item) => item.creator_id === userId));
        } else if (userRole === "Аналитик СД") {
          setConclusions(formattedData.filter((item) => item.region === userRegion));
        } else {
          setConclusions(formattedData);
        }

        setFilteredConclusions(formattedData); // Устанавливаем все данные
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConclusions();
  }, [userRole, userRegion, token]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    const filteredData = conclusions.filter((conclusion) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]?.toLowerCase() || "";
        const conclusionValue = (conclusion[key] || "").toLowerCase();

        if (filterValue === "") return true;
        return conclusionValue.includes(filterValue);
      });
    });
    setFilteredConclusions(filteredData);
  }, [filters, conclusions]);

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3350/api/cards/export/excel`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Журнал_Заключений.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setError("Failed to export to Excel: " + (error.message || "Unknown error"));
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3350/api/cards/export/pdf`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Журнал_Заключений.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      setError("Failed to export to PDF: " + (error.message || "Unknown error"));
    }
  };

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Журнал заключений
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Регистрационный номер"
          variant="outlined"
          name="registration_number"
          value={filters.registration_number}
          onChange={handleFilterChange}
        />
        <TextField
          label="Статус документа"
          variant="outlined"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        />
        <TextField
          label="Регион"
          variant="outlined"
          name="region"
          value={filters.region}
          onChange={handleFilterChange}
        />
        <TextField
          label="ФИО согласующего"
          variant="outlined"
          name="approver_name"
          value={filters.approver_name}
          onChange={handleFilterChange}
        />
        <TextField
          label="Дата создания с"
          variant="outlined"
          type="date"
          name="creation_date_from"
          value={filters.creation_date_from}
          onChange={handleFilterChange}
        />
        <TextField
          label="Дата создания по"
          variant="outlined"
          type="date"
          name="creation_date_to"
          value={filters.creation_date_to}
          onChange={handleFilterChange}
        />
        <TextField
          label="ИИН вызываемого"
          variant="outlined"
          name="iin"
          value={filters.iin}
          onChange={handleFilterChange}
        />
        <TextField
          label="Номер УД"
          variant="outlined"
          name="case_number"
          value={filters.case_number}
          onChange={handleFilterChange}
        />
      </Box>

      <Box mb={3}>
        <Button variant="contained" color="primary" onClick={handleExportExcel}>
          Экспорт в Excel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleExportPdf} sx={{ ml: 2 }}>
          Экспорт в PDF
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Регистрационный номер</TableCell>
              <TableCell>Дата создания документа</TableCell>
              <TableCell>ИИН вызываемого</TableCell>
              <TableCell>ФИО вызываемого</TableCell>
              <TableCell>Номер УД</TableCell>
              <TableCell>Статья УК</TableCell>
              <TableCell>Время прихода</TableCell>
              <TableCell>Время ухода</TableCell>
              <TableCell>Место работы</TableCell>
              <TableCell>Должность</TableCell>
              <TableCell>Регион</TableCell>
              <TableCell>Относится ли к бизнесу</TableCell>
              <TableCell>Статус документа</TableCell>
              <TableCell>ФИО согласующего</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredConclusions.map((conclusion) => (
              <TableRow key={conclusion._id || conclusion.id}>
                <TableCell>{conclusion.registration_number}</TableCell>
             
                <TableCell>{conclusion.creation_date}</TableCell>
                <TableCell>{conclusion.ИИН_вызываемого}</TableCell>
                <TableCell>{conclusion.ФИО_вызываемого}</TableCell>
                <TableCell>{conclusion.case_number}</TableCell>
                <TableCell>{conclusion.статья_ук_казахстана}</TableCell>
                <TableCell>{conclusion.дата_и_время_проведения}</TableCell>
                <TableCell>{conclusion.время_ухода}</TableCell>
                <TableCell>{conclusion.место_работы}</TableCell>
                <TableCell>{conclusion.должность_вызываемого}</TableCell>
                <TableCell>{conclusion.регион}</TableCell>
                <TableCell>{conclusion.business_related ? "Да" : "Нет"}</TableCell>
                <TableCell>{conclusion.status}</TableCell>
                <TableCell>{conclusion.approver_name}</TableCell>

                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => window.open(`/card-details/${conclusion._id}`, "_blank")}
                  >
                    Просмотреть
                  </Button>
                </TableCell>


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ConclusionsJournalPage;
