import psycopg2 as pg
from decouple import config
import psycopg2.extras as pg_extras


class Model:
    def __init__(self):
        self.conn = pg.connect(config('DB_URL'))
        self.cursor = self.conn.cursor(
            cursor_factory=pg_extras.RealDictCursor
        )
        
    def get_chat_history(self, session_id):
        try:
            query = '''
                SELECT role, parts
                FROM chat_history WHERE session_id = %s
                ORDER BY created_datetime ASC
            '''
            self.cursor.execute(query, (session_id,))
            rows = self.cursor.fetchall()
            return rows if rows else []
        
        except Exception as e:
            self.conn.rollback()
            return []
        
    def insert_chat(self, session_id, legend, role, parts):
        try:
            query = '''
                INSERT INTO chat_history (session_id, legend, role, parts)
                VALUES (%s, %s, %s, %s)
            '''
            self.cursor.execute(query, (session_id, legend, role, pg_extras.Json(parts)))
            self.conn.commit()
            return self.cursor.rowcount
        
        except Exception as e:
            self.conn.rollback()
            return None
