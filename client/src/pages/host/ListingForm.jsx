import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/client.js';
import { STAY_TYPES } from '../../utils/format.js';

const empty = {
  title: '',
  description: '',
  type: 'homestay',
  city: '',
  state: '',
  address: '',
  pricePerNight: '',
  maxGuests: 2,
  bedrooms: 1,
  amenities: '',
  imageUrl: '',
};

const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const validate = (form) => {
  const errors = {};
  const title = form.title?.trim() || '';
  if (title.length < 10 || title.length > 100) {
    errors.title = 'Title must be between 10 and 100 characters';
  }

  const description = form.description?.trim() || '';
  if (description.length < 30) {
    errors.description = 'Description must be at least 30 characters';
  }

  const price = Number(form.pricePerNight);
  if (form.pricePerNight === '' || isNaN(price) || price <= 0) {
    errors.pricePerNight = 'Price per night must be greater than 0';
  }

  if (form.imageUrl && form.imageUrl.length > 0) {
    const trimmed = form.imageUrl.trim();
    if (!trimmed || !isValidUrl(trimmed)) {
      errors.imageUrl = 'Image URL must be a valid URL';
    }
  }

  return errors;
};

export default function ListingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');

  const errors = validate(form);
  const hasErrors = Object.keys(errors).length > 0;
  const hasEmptyRequired =
    !form.title?.trim() ||
    !form.description?.trim() ||
    !form.city?.trim() ||
    !form.state?.trim() ||
    !form.address?.trim() ||
    !form.pricePerNight;
  const isSubmitDisabled = hasErrors || hasEmptyRequired;

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/listings/${id}`).then(({ data }) =>
      setForm({
        ...empty,
        ...data,
        amenities: data.amenities.join(', '),
        imageUrl: data.images[0] || '',
      })
    );
  }, [id, isEdit]);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const blur = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  // TODO: replace the image URL field with real image upload (Cloudinary / multer).
  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0 || hasEmptyRequired) {
      setTouched({
        title: true,
        description: true,
        pricePerNight: true,
        imageUrl: true,
      });
      return;
    }

    const { title, description, type, city, state, address, imageUrl, amenities } = form;
    const payload = {
      title: title.trim(),
      description: description.trim(),
      type,
      city: city.trim(),
      state: state.trim(),
      address: address.trim(),
      pricePerNight: Number(form.pricePerNight),
      maxGuests: Number(form.maxGuests),
      bedrooms: Number(form.bedrooms),
      amenities: amenities.split(',').map((a) => a.trim()).filter(Boolean),
    };
    if (imageUrl?.trim()) payload.images = [imageUrl.trim()];
    try {
      if (isEdit) await api.put(`/listings/${id}`, payload);
      else await api.post('/listings', payload);
      navigate('/host');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form className="card form wide" onSubmit={submit}>
      <h1>{isEdit ? 'Edit listing' : 'Create a new listing'}</h1>
      <div>
        <input required placeholder="Title" value={form.title} onChange={set('title')} onBlur={blur('title')} />
        {touched.title && errors.title && <p className="error small" style={{ margin: '4px 0 0' }}>{errors.title}</p>}
      </div>
      <div>
        <textarea required placeholder="Describe your place" value={form.description} onChange={set('description')} onBlur={blur('description')} />
        {touched.description && errors.description && <p className="error small" style={{ margin: '4px 0 0' }}>{errors.description}</p>}
      </div>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <select value={form.type} onChange={set('type')}>
          {STAY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <div className="grow">
          <input required type="number" min="1" placeholder="Price per night (₹)" value={form.pricePerNight} onChange={set('pricePerNight')} onBlur={blur('pricePerNight')} />
          {touched.pricePerNight && errors.pricePerNight && <p className="error small" style={{ margin: '4px 0 0' }}>{errors.pricePerNight}</p>}
        </div>
      </div>
      <div className="row">
        <input required placeholder="City" value={form.city} onChange={set('city')} />
        <input required placeholder="State" value={form.state} onChange={set('state')} />
      </div>
      <input required placeholder="Address" value={form.address} onChange={set('address')} />
      <div className="row">
        <label className="grow">Max guests
          <input type="number" min="1" value={form.maxGuests} onChange={set('maxGuests')} />
        </label>
        <label className="grow">Bedrooms
          <input type="number" min="0" value={form.bedrooms} onChange={set('bedrooms')} />
        </label>
      </div>
      <input placeholder="Amenities (comma separated: WiFi, AC, Parking)" value={form.amenities} onChange={set('amenities')} />
      <div>
        <input placeholder="Image URL (optional)" value={form.imageUrl} onChange={set('imageUrl')} onBlur={blur('imageUrl')} />
        {touched.imageUrl && errors.imageUrl && <p className="error small" style={{ margin: '4px 0 0' }}>{errors.imageUrl}</p>}
      </div>
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={isSubmitDisabled}>{isEdit ? 'Save changes' : 'Publish listing'}</button>
    </form>
  );
}
