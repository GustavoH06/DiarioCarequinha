## Go to frontend
cd <frontend>

## Install dependencies
npm i

## Go to backend
cd <server>

## Create Venv environment
python -m venv venv

## Activate venv
Linux:source venv/bin/activate
Windows: venv/Scripts/activate

## Install dependencies
pip install -r requirements.txt

### if cors is being troublesome
flask run --host=0.0.0.0 --port=5000
set 5000 port to public
