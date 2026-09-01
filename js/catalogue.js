import monopolyImage from '../images/products-2026/monopoly.webp';
import chessImage from '../images/products-2026/chess.webp';
import scrabbleImage from '../images/products-2026/scrabble.webp';
import battleshipImage from '../images/products-2026/battleship.webp';
import trivialPursuitImage from '../images/products-2026/trivial-pursuit.webp';
import draughtsImage from '../images/products-2026/draughts.webp';
import connectFourImage from '../images/products-2026/connect-four.webp';
import cluedoImage from '../images/products-2026/cluedo.webp';
import snakesAndLaddersImage from '../images/products-2026/snakes-and-ladders.webp';
import riskImage from '../images/products-2026/risk.webp';

export const products = [
  {
    name: 'Monopoly',
    tag: 'monopoly',
    price: 3050,
    category: 'Property & negotiation',
    image: monopolyImage,
    alt: 'Monopoly game set displayed on a warm neutral tabletop',
  },
  {
    name: 'Chess',
    tag: 'chess',
    price: 2350,
    category: 'Abstract strategy',
    image: chessImage,
    alt: 'Mainstreet Classics chess and games set displayed with chess pieces and accessories',
  },
  {
    name: 'Scrabble',
    tag: 'scrabble',
    price: 1050,
    category: 'Word game',
    image: scrabbleImage,
    alt: 'Scrabble game set displayed with board, tiles and storage tin',
  },
  {
    name: 'Battleship',
    tag: 'battleship',
    price: 1450,
    category: 'Strategy & deduction',
    image: battleshipImage,
    alt: 'Battleship game set displayed with boards, ships and pegs',
  },
  {
    name: 'Trivial Pursuit',
    tag: 'trivialpursuit',
    price: 1150,
    category: 'Trivia',
    image: trivialPursuitImage,
    alt: 'Trivial Pursuit game set displayed with board, cards and category pieces',
  },
  {
    name: 'Draughts',
    tag: 'draughts',
    price: 1350,
    category: 'Abstract strategy',
    image: draughtsImage,
    alt: 'Wooden draughts board displayed with light and dark pieces',
  },
  {
    name: 'Connect Four',
    tag: 'connectfour',
    price: 1250,
    category: 'Connection strategy',
    image: connectFourImage,
    alt: 'Connect Four game set displayed with grid and playing discs',
  },
  {
    name: 'Cluedo',
    tag: 'cluedo',
    price: 1150,
    category: 'Mystery & deduction',
    image: cluedoImage,
    alt: 'Cluedo game set displayed with board, character pieces and accessories',
  },
  {
    name: 'Snakes and Ladders',
    tag: 'snakesandladders',
    price: 750,
    category: 'Family classic',
    image: snakesAndLaddersImage,
    alt: 'Snakes and Ladders game set displayed with board, pawns and dice',
  },
  {
    name: 'Risk',
    tag: 'risk',
    price: 1350,
    category: 'World strategy',
    image: riskImage,
    alt: 'Risk game set displayed with world map board, pieces, cards and dice',
  },
];

export const productByTag = new Map(
  products.map((product) => [product.tag, product]),
);
