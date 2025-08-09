exports.handler = async (event, context) => {
  // التحقق من HTTP Method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // الحصول على المعلومات الآمنة من Environment Variables
    const config = {
      webhook: {
        url: process.env.N8N_WEBHOOK_URL,
        auth: process.env.N8N_AUTH_TOKEN
      },
      ghl: {
        accessToken: process.env.GHL_ACCESS_TOKEN,
        locationId: process.env.GHL_LOCATION_ID
      }
    };

    // إعادة توجيه الطلب إلى n8n مع البيانات الآمنة
    const response = await fetch(config.webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': config.webhook.auth
      },
      body: event.body
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
