"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wallet, Plus, Banknote, CheckCircle, XCircle, Smartphone } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function getWallet(userId: string) {
  const wallets = JSON.parse(localStorage.getItem("wallets") || "{}")
  return wallets[userId] || { withdrawable: 0, usable: 0, transactions: [] };
}
function setWallet(userId: string, wallet: any) {
  const wallets = JSON.parse(localStorage.getItem("wallets") || "{}")
  wallets[userId] = wallet;
  localStorage.setItem("wallets", JSON.stringify(wallets));
}

export default function WalletPage() {
  const [user, setUser] = useState<any>(null);
  const [wallet, setWalletState] = useState<any>({ withdrawable: 0, usable: 0, transactions: [] });
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawDetails, setWithdrawDetails] = useState({ upi: "", bank: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawTab, setWithdrawTab] = useState<string>('upi');
  const [bankDetails, setBankDetails] = useState({
    account: '',
    confirmAccount: '',
    ifsc: '',
    holder: '',
  });
  const [upiBank, setUpiBank] = useState('');
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const userObj = JSON.parse(currentUser);
      setUser(userObj);
      const w = getWallet(userObj.id);
      setWalletState(w);
    }
    // Listen for wallet changes
    const onStorage = (e: StorageEvent) => {
      if (e.key === "wallets") {
        const userObj = JSON.parse(localStorage.getItem("currentUser") || "{}")
        setWalletState(getWallet(userObj.id));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      toast({ title: "Invalid Amount", description: "Enter a valid amount to withdraw." });
      return;
    }
    if (Number(withdrawAmount) > wallet.withdrawable) {
      toast({ title: "Insufficient Balance", description: "You don't have enough withdrawable balance." });
      return;
    }
    if (!withdrawDetails.upi && !withdrawDetails.bank) {
      toast({ title: "Details Required", description: "Enter UPI ID or Bank Account details." });
      return;
    }
    // Simulate OTP send
    setOtpSent(true);
    toast({ title: "OTP Sent", description: "OTP sent to your registered mobile number." });
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Enter the 6-digit OTP." });
      return;
    }
    setOtpVerified(true);
    // Simulate withdrawal request
    setTimeout(() => {
      // Use the same string ID for both transaction and withdrawal request
      const id = Date.now().toString();
      // Deduct from wallet and add transaction
      const newWallet = { ...wallet };
      newWallet.withdrawable -= Number(withdrawAmount);
      newWallet.transactions.unshift({
        id,
        transactionId: id,
        type: "withdrawal",
        amount: Number(withdrawAmount),
        category: "Withdrawable",
        status: "pending",
        date: new Date().toISOString(),
        note: `Withdrawal to ${withdrawDetails.upi || bankDetails.account}`,
      });
      setWallet(user.id, newWallet);
      setWalletState(newWallet);
      // Save withdrawal request for admin
      const withdrawalRequests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]");
      withdrawalRequests.push({
        id, // use the same id
        transactionId: id,
        userId: user.id,
        name: user.name,
        email: user.email,
        amount: Number(withdrawAmount),
        method: withdrawTab,
        upi: withdrawTab === 'upi' ? withdrawDetails.upi : undefined,
        bank: withdrawTab === 'bank' ? { ...bankDetails } : undefined,
        status: "pending",
        date: new Date().toISOString(),
      });
      localStorage.setItem("withdrawalRequests", JSON.stringify(withdrawalRequests));
      setShowWithdraw(false);
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      setWithdrawAmount("");
      setWithdrawDetails({ upi: "", bank: "" });
      toast({ title: "Withdrawal Requested", description: "Your withdrawal request has been sent to admin." });
    }, 1000);
  };

  function isValidUpiHandle(upi: string) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upi);
  }

  return (
    <div className="min-h-screen bg-accent pb-20">
      <div className="gradient-bg p-4 flex items-center space-x-3 text-white mb-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Wallet className="w-7 h-7 mr-2" />
        <h1 className="text-xl font-bold">My Wallet</h1>
      </div>
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">₹{typeof wallet.withdrawable === "number" ? wallet.withdrawable.toLocaleString() : "0"}</div>
                <div className="text-xs text-muted-foreground">Withdrawable Amount</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">₹{typeof wallet.usable === "number" ? wallet.usable.toLocaleString() : "0"}</div>
                <div className="text-xs text-muted-foreground">Usable Amount</div>
              </div>
            </div>
            <Button className="w-full mt-6" onClick={() => setShowWithdraw(true)} disabled={wallet.withdrawable <= 0}>
              <Banknote className="w-5 h-5 mr-2" /> Withdraw
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {wallet.transactions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No transactions yet.</div>
            ) : (
              <div className="space-y-3">
                {wallet.transactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <div className="font-semibold">
                        {tx.type === "sale-credit" && <span>Sale Credit</span>}
                        {tx.type === "admin-credit" && <span>GradKartGo</span>}
                        {tx.type === "admin-restore" && <span>Restored</span>}
                        {tx.type === "purchase" && <span>Purchase</span>}
                        {tx.type === "withdrawal" && <span>Withdrawal</span>}
                        {tx.type === "cashback" && <span>Cashback</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tx.type === "admin-credit" ? 'Cashback/Promotion' : tx.note}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        tx.type === "withdrawal" || tx.type === "purchase" || tx.type === "admin-restore" ? "text-red-600" : "text-green-600"
                      }`}>
                        {tx.type === "withdrawal" || tx.type === "purchase" || tx.type === "admin-restore" ? "-" : "+"}₹{typeof tx.amount === "number" ? tx.amount.toLocaleString() : "0"}
                      </div>
                      <div className="text-xs text-muted-foreground">{tx.date ? new Date(tx.date).toLocaleString() : ""}</div>
                      <Badge variant={
                        tx.status === "restored" ? "destructive" : 
                        tx.status === "pending" ? "secondary" : 
                        (tx.status === "success" || tx.status === "completed") ? "secondary" : "destructive"
                      } className={
                        tx.status === "restored" ? "bg-red-100 text-red-700" :
                        tx.status === "success" || tx.status === "completed" ? "bg-green-100 text-green-700" : ""
                      }>
                        {tx.status === "restored" ? "Expired" : 
                         (tx.status === "completed" ? "Success" : (tx.status || "pending")).charAt(0).toUpperCase() + (tx.status === "completed" ? "success" : (tx.status || "pending")).slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
          </DialogHeader>
          <Tabs value={withdrawTab} onValueChange={setWithdrawTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="upi">UPI Transfer</TabsTrigger>
              <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
            </TabsList>
            <TabsContent value="upi">
              <Input
                placeholder="Amount to withdraw"
                type="number"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                min={1}
                max={typeof wallet.withdrawable === 'number' && !isNaN(wallet.withdrawable) ? wallet.withdrawable.toString() : '0'}
              />
              {withdrawAmount && Number(withdrawAmount) > wallet.withdrawable && (
                <div className="text-red-500 text-xs mt-1">Amount exceeds available balance</div>
              )}
              <Input
                placeholder="UPI ID (e.g. user@upi)"
                value={withdrawDetails.upi}
                onChange={e => setWithdrawDetails({ ...withdrawDetails, upi: e.target.value })}
              />
              {withdrawDetails.upi && !isValidUpiHandle(withdrawDetails.upi) && (
                <div className="text-red-500 text-xs mt-1">Enter a valid UPI handle (e.g. example@upi)</div>
              )}
              {upiBank && <div className="text-xs text-muted-foreground mb-2">Bank Detected: {upiBank}</div>}
              {!otpSent && !showReview ? (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                  onClick={() => setShowReview(true)}
                  disabled={!isValidUpiHandle(withdrawDetails.upi) || !withdrawAmount || Number(withdrawAmount) > wallet.withdrawable || Number(withdrawAmount) <= 0}
                >
                  <Smartphone className="w-5 h-5 mr-2" /> Review & Continue
                </Button>
              ) : !otpSent && showReview ? (
                <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-xl border">
                  <div className="font-semibold text-lg mb-2">Review Withdrawal</div>
                  <div>Amount: <span className="font-bold">₹{withdrawAmount}</span></div>
                  <div>UPI ID: <span className="font-bold">{withdrawDetails.upi}</span></div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleWithdraw}
                  >
                    <Smartphone className="w-5 h-5 mr-2" /> Send OTP
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setShowReview(false)}>Edit</Button>
                </div>
              ) : !otpVerified ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleVerifyOtp}>
                    <CheckCircle className="w-5 h-5 mr-2" /> Verify & Submit Withdrawal
                  </Button>
                </div>
              ) : (
                <div className="text-green-600 text-center font-semibold">OTP Verified!</div>
              )}
            </TabsContent>
            <TabsContent value="bank">
              <Input
                placeholder="Amount to withdraw"
                type="number"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                min={1}
                max={typeof wallet.withdrawable === 'number' && !isNaN(wallet.withdrawable) ? wallet.withdrawable.toString() : '0'}
              />
              {withdrawAmount && Number(withdrawAmount) > wallet.withdrawable && (
                <div className="text-red-500 text-xs mt-1">Amount exceeds available balance</div>
              )}
              <Input
                placeholder="Bank Account Number"
                value={bankDetails.account}
                onChange={e => setBankDetails({ ...bankDetails, account: e.target.value })}
              />
              <Input
                placeholder="Confirm Bank Account Number"
                value={bankDetails.confirmAccount}
                onChange={e => setBankDetails({ ...bankDetails, confirmAccount: e.target.value })}
              />
              <Input
                placeholder="IFSC Code"
                value={bankDetails.ifsc}
                onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
              />
              <Input
                placeholder="Account Holder Name"
                value={bankDetails.holder}
                onChange={e => setBankDetails({ ...bankDetails, holder: e.target.value })}
              />
              {!otpSent && !showReview ? (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                  onClick={() => setShowReview(true)}
                  disabled={!withdrawAmount || Number(withdrawAmount) > wallet.withdrawable || Number(withdrawAmount) <= 0 || !bankDetails.account || !bankDetails.confirmAccount || !bankDetails.ifsc || !bankDetails.holder || bankDetails.account !== bankDetails.confirmAccount}
                >
                  <Smartphone className="w-5 h-5 mr-2" /> Review & Continue
                </Button>
              ) : !otpSent && showReview ? (
                <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-xl border">
                  <div className="font-semibold text-lg mb-2">Review Withdrawal</div>
                  <div>Amount: <span className="font-bold">₹{withdrawAmount}</span></div>
                  <div>Account Number: <span className="font-bold">{bankDetails.account}</span></div>
                  <div>IFSC: <span className="font-bold">{bankDetails.ifsc}</span></div>
                  <div>Account Holder: <span className="font-bold">{bankDetails.holder}</span></div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => { setShowReview(false); setOtpSent(true); toast({ title: "OTP Sent", description: "OTP sent to your registered mobile number." }); }}
                  >
                    <Smartphone className="w-5 h-5 mr-2" /> Send OTP
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setShowReview(false)}>Edit</Button>
                </div>
              ) : !otpVerified ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleVerifyOtp}>
                    <CheckCircle className="w-5 h-5 mr-2" /> Verify & Submit Withdrawal
                  </Button>
                </div>
              ) : (
                <div className="text-green-600 text-center font-semibold">OTP Verified!</div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
} 