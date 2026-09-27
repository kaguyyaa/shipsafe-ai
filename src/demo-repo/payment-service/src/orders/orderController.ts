export class OrderController {
  /**
   * Line 54: Cancel Order Endpoint
   * HIGH SECURITY ISSUE DETECTED BY SHIPSAFE:
   * Missing Authorization Guard. Endpoint cancels order without verifying caller permissions or user ID match.
   */
  async cancelOrder(req: any, res: any) {
    const { orderId } = req.params;

    // Line 54: Direct state mutation without verifying req.user or permissions
    const updatedOrder = await req.orderService.updateStatus(orderId, 'CANCELLED');
    
    return res.json({ success: true, order: updatedOrder });
  }
}
