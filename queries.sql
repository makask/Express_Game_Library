CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  release_date DATE,
  picture_url TEXT,
  description TEXT,
  review TEXT, 
  genre VARCHAR(50),
  metacritic FLOAT,
  my_rating FLOAT
);

INSERT INTO games (title, release_date, picture_url, description, review, genre, metacritic, my_rating)
VALUES
('Red Alert', '1996-05-01', 'https://media.rawg.io/media/games/e87/e87bbd9feb37b226b1b6a4f11e9492a0.jpg','Test description',
'Test review', 'RTS', 4.5, 6.7);