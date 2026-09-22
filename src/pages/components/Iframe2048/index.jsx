const Iframe2048 = () => {
  return (
    <div style={{ marginTop: '20px' }}>
      <iframe
        src={`${import.meta.env.BASE_URL}iframe2048/game2048.html`}
        title='咩'
        style={{ width: '600px', height: '600px', border: 'none' }}
      />
    </div>
  )
}

export default Iframe2048
