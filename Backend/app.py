from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_soap import FlaskSoap

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://your_username:your_password@localhost/your_database_name'
db = SQLAlchemy(app)
soap = FlaskSoap(app)

class Zone(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(50), nullable=False)

# Define SOAP service
@soap.service()
class ZonesService:
    @soap.operation()
    def GetZones(type):
        try:
            zones = Zone.query.filter_by(type=type).all()
            result = [{'name': zone.name, 'lat': zone.lat, 'lng': zone.lng} for zone in zones]
            return result
        except Exception as e:
            return {'error': 'Internal Server Error'}

# Define REST endpoint
@app.route('/zones/<string:type>')
def get_zones(type):
    try:
        zones = Zone.query.filter_by(type=type).all()
        result = [{'name': zone.name, 'lat': zone.lat, 'lng': zone.lng} for zone in zones]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': 'Internal Server Error'})

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
