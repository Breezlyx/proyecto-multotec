import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, '../../data/database.sqlite')

// Crear carpeta data si no existe
const dataDir = join(__dirname, '../../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err)
  } else {
    console.log('✅ Base de datos SQLite conectada:', dbPath)
    initializeDatabase()
  }
})

// Helper para promesas
export const runAsync = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err)
      else resolve({ id: this.lastID, changes: this.changes })
    })
  })
}

export const getAsync = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

export const allAsync = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

function initializeDatabase() {
  db.serialize(() => {
    // Tabla de Proyectos
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        client TEXT NOT NULL,
        description TEXT,
        start_date TEXT,
        end_date TEXT,
        status TEXT DEFAULT 'planned',
        progress INTEGER DEFAULT 0,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Tabla de Miembros del Equipo
    db.run(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        availability TEXT DEFAULT 'available',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Tabla de Tareas
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'planned',
        due_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
      )
    `)

    // Tabla de Riesgos
    db.run(`
      CREATE TABLE IF NOT EXISTS risks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        probability TEXT,
        impact TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
      )
    `)

    // Tabla de Asignación de Recursos a Proyectos
    db.run(`
      CREATE TABLE IF NOT EXISTS project_resources (
        project_id INTEGER NOT NULL,
        resource_id INTEGER NOT NULL,
        role TEXT,
        PRIMARY KEY (project_id, resource_id),
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
        FOREIGN KEY (resource_id) REFERENCES team_members (id) ON DELETE CASCADE
      )
    `)

    // Insertar datos iniciales
    db.run(`
      INSERT OR IGNORE INTO projects (id, name, client, description, start_date, end_date, status, progress, budget, spent)
      VALUES 
        (1, 'PULP SAMPLING SYSTEM 1230-25 REV.1', 'Newmont Suriname LLC', 'Sistema de muestreo de pulpa avanzado', '2025-08-15', '2026-07-14', 'inprogress', 45, 150000, 75000),
        (2, 'Mejora Sistema Filtrado', 'Minera Los Pelambres', 'Mejora en el sistema de filtrado', '2025-09-01', '2026-03-15', 'inprogress', 60, 120000, 72000),
        (3, 'Automatización Planta Secundaria', 'Codelco Andina', 'Automatización completa de la planta secundaria', '2025-07-10', '2026-01-30', 'completed', 100, 200000, 200000)
    `)

    db.run(`
      INSERT OR IGNORE INTO team_members (id, name, role, email, phone, availability)
      VALUES 
        (1, 'Luis Sandoval', 'Project Manager', 'luis.sandoval@multotec.com', '56973762183', 'available'),
        (2, 'Andrés Vallebella', 'Chief Engineering', 'andres.vallebella@multotec.com', '56227453317', 'available'),
        (3, 'Leandro Flores', 'Electrical and Control Specialist', 'leandro.flores@multotec.com', '56990874153', 'assigned')
    `)

    console.log('✅ Tablas de base de datos inicializadas')
  })
}

export default db
