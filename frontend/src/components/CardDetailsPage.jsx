import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import { useParams } from "react-router-dom"; // For accessing URL params

const CardDetailsPage = () => {
  const { id } = useParams(); // Get the card ID from the URL
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCardDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3350/api/cards/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Card data fetched:", response.data);
        setCardData(response.data);
      } catch (err) {
        console.error("Error fetching card data:", err);
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [id, token]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!cardData) {
    return <Typography variant="h6" color="error">Card not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Карточка документа
      </Typography>

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
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={cardData._id}>
              <TableCell>{cardData.registration_number}</TableCell>
              <TableCell>{cardData.creation_date}</TableCell>
              <TableCell>{cardData.ИИН_вызываемого}</TableCell>
              <TableCell>{cardData.ФИО_вызываемого}</TableCell>
              <TableCell>{cardData.case_number}</TableCell>
              <TableCell>{cardData.статья_ук_казахстана}</TableCell>
              <TableCell>{cardData.дата_и_время_проведения}</TableCell>
              <TableCell>{cardData.время_ухода}</TableCell>
              <TableCell>{cardData.место_работы}</TableCell>
              <TableCell>{cardData.должность_вызываемого}</TableCell>
              <TableCell>{cardData.регион}</TableCell>
              <TableCell>{cardData.business_related ? "Да" : "Нет"}</TableCell>
              <TableCell>{cardData.status}</TableCell>
              <TableCell>{cardData.approver_name}</TableCell>
              <TableCell>{cardData.approval_path}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => window.history.back()}
        >
          Вернуться
        </Button>
      </Box>
    </Box>
  );
};

export default CardDetailsPage;
