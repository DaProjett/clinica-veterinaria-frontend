export const mockMascotas = [
  {
    id: 1,
    nombre: "Firulais",
    especie: "Perro",
    raza: "Labrador",
    fechaNacimiento: "2020-05-15",
    sexo: "MACHO",
    color: "Dorado",
    peso: 25.5,
    dueno: {
      id: 1,
      nombreCompleto: "Juan Pérez",
      documentoIdentidad: "12345678",
      telefono: "555-1234",
      email: "juan@email.com",
      direccion: "Calle 123 #45-67"
    },
    fechaRegistro: "2023-01-10"
  },
  {
    id: 2,
    nombre: "Mia",
    especie: "Gato",
    raza: "Siames",
    fechaNacimiento: "2021-08-20",
    sexo: "HEMBRA",
    color: "Blanco y crema",
    peso: 3.8,
    dueno: {
      id: 2,
      nombreCompleto: "María González",
      documentoIdentidad: "87654321",
      telefono: "555-5678",
      email: "maria@email.com",
      direccion: "Avenida 78 #90-12"
    },
    fechaRegistro: "2023-02-15"
  },
  {
    id: 3,
    nombre: "Rocky",
    especie: "Perro",
    raza: "Pitbull",
    fechaNacimiento: "2019-12-10",
    sexo: "MACHO",
    color: "Gris",
    peso: 32.0,
    dueno: {
      id: 1,
      nombreCompleto: "Juan Pérez",
      documentoIdentidad: "12345678",
      telefono: "555-1234",
      email: "juan@email.com",
      direccion: "Calle 123 #45-67"
    },
    fechaRegistro: "2023-03-20"
  }
];

export const mockDuenos = [
  {
    id: 1,
    nombreCompleto: "Juan Pérez",
    documentoIdentidad: "12345678",
    telefono: "555-1234",
    email: "juan@email.com",
    direccion: "Calle 123 #45-67",
    fechaRegistro: "2023-01-01T10:00:00"
  },
  {
    id: 2,
    nombreCompleto: "María González",
    documentoIdentidad: "87654321",
    telefono: "555-5678",
    email: "maria@email.com",
    direccion: "Avenida 78 #90-12",
    fechaRegistro: "2023-02-01T15:30:00"
  }
];